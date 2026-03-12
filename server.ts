import express from "express";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to get a configured OAuth2 client dynamically
  const getOAuthClient = (req: express.Request) => {
    // Use the official APP_URL provided by the environment
    const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
    const redirectUri = `${appUrl.replace(/\/$/, '')}/api/auth/google/callback`;
    
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );
  };

  // In a real app, you'd store this in a database
  // For this demo, we'll use a simple in-memory store or assume the user will provide it
  let ownerTokens: any = null;

  // Helper to send email via Gmail API
  const sendEmail = async (client: any, to: string, subject: string, body: string) => {
    const gmail = google.gmail({ version: 'v1', auth: client });
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      body,
    ];
    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
  };

  // API Routes
  app.get("/api/auth/google/url", (req, res) => {
    const client = getOAuthClient(req);
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/gmail.send"
      ],
      prompt: "consent",
    });
    res.json({ url });
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    const { code, error: googleError } = req.query;
    
    if (googleError) {
      console.error("Google OAuth Error:", googleError);
      return res.status(400).send(`Authentication failed: ${googleError}`);
    }

    try {
      const client = getOAuthClient(req);
      const { tokens } = await client.getToken(code as string);
      ownerTokens = tokens;
      
      res.send(`
        <html>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0a0a1a; color: white;">
            <div style="text-align: center; padding: 2rem; background: rgba(255,255,255,0.05); border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1);">
              <h1 style="color: #00f5ff;">Connection Successful!</h1>
              <p>Your Google Calendar is now connected to MindSpark AI.</p>
              <p>You can close this window now.</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
                  setTimeout(() => window.close(), 2000);
                }
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Error exchanging code:", error);
      const details = error.response?.data?.error_description || error.message || "Unknown error";
      res.status(500).send(`
        <div style="font-family: sans-serif; padding: 20px; color: #ff4444;">
          <h1>Authentication Failed</h1>
          <p><strong>Details:</strong> ${details}</p>
          <p>This usually means the <strong>GOOGLE_CLIENT_SECRET</strong> is incorrect or the <strong>Redirect URI</strong> in your Google Console doesn't match exactly.</p>
          <button onclick="window.close()">Close and Try Again</button>
        </div>
      `);
    }
  });

  app.get("/api/calendar/status", (req, res) => {
    res.json({ connected: !!ownerTokens });
  });

  app.post("/api/notify-upload", async (req, res) => {
    const { clientName, instructions, fileCount, folderPath } = req.body;
    
    if (!ownerTokens) {
      console.warn("Owner tokens not available for notification");
      return res.json({ success: false, error: "Owner not connected" });
    }

    try {
      const client = getOAuthClient(req);
      client.setCredentials(ownerTokens);
      
      const ownerEmail = process.env.OWNER_EMAIL || "brentplascencia@gmail.com";
      const mailBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #fdfdfd; color: #1f2937;">
          <h2 style="color: #00d8ff; font-size: 20px; font-weight: 700; margin-bottom: 24px;">🚀 New Client Upload Received</h2>
          
          <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
            <p style="margin: 8px 0; font-size: 15px;"><strong>Client:</strong> ${clientName}</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Files Uploaded:</strong> ${fileCount}</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Storage Path:</strong> ${folderPath}</p>
            <p style="margin: 16px 0 8px 0; font-size: 15px;"><strong>Instructions:</strong></p>
            <div style="background: #f9fafb; padding: 12px; border-radius: 8px; font-size: 14px; color: #4b5563; border: 1px solid #f3f4f6;">
              ${instructions || 'No special instructions provided.'}
            </div>
          </div>

          <p style="font-size: 14px; color: #6b7280;">The 24-hour turnaround clock has started. Check your Firebase Storage for the assets.</p>
        </div>
      `;

      await sendEmail(client, ownerEmail, `MindSpark Website: New Upload from ${clientName}`, mailBody);
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending upload notification:", error);
      res.status(500).json({ success: false });
    }
  });

  app.post("/api/calendar/book", async (req, res) => {
    if (!ownerTokens) {
      return res.status(400).json({ error: "Calendar not connected by owner" });
    }

    const { name, email, date, time, contactMethod, phone } = req.body;
    
    try {
      const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      client.setCredentials(ownerTokens);
      
      const calendar = google.calendar({ version: "v3", auth: client });
      
      const startDateTimeStr = `${date}T${time}:00`;
      const [hours, minutes] = time.split(':').map(Number);
      let endHours = hours;
      let endMinutes = minutes + 30;
      if (endMinutes >= 60) {
        endHours += 1;
        endMinutes -= 60;
      }
      const endDateTimeStr = `${date}T${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}:00`;

      const contactInfo = contactMethod === 'Phone' ? `Phone: ${phone}` : `Method: ${contactMethod}`;

      const event = {
        summary: `AI Audit: ${name} (${contactMethod})`,
        description: `Booking for ${name} (${email}) via MindSpark AI website.\nPreferred Contact: ${contactInfo}\n\nNote: Host is located on the East Coast (US Eastern Time). Your calendar should automatically adjust this to your local time.`,
        start: {
          dateTime: startDateTimeStr,
          timeZone: "America/New_York",
        },
        end: {
          dateTime: endDateTimeStr,
          timeZone: "America/New_York",
        },
        attendees: [{ email }],
      };

      await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });

      // Send Thank You Email to User
      let platformLink = '';
      let platformAction = '';
      if (contactMethod === 'Zoom') {
        platformLink = 'https://zoom.us/download';
        platformAction = 'Download Zoom';
      } else if (contactMethod === 'Microsoft Teams') {
        platformLink = 'https://www.microsoft.com/en-us/microsoft-teams/download-app';
        platformAction = 'Download Microsoft Teams';
      } else if (contactMethod === 'Google Meet') {
        platformLink = 'https://meet.google.com/';
        platformAction = 'Open Google Meet';
      }

      const userMailBody = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; color: #1f2937;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://lh3.googleusercontent.com/d/1EIouJiPfVcHynVoi5BKGv-HrfwC62FjJ" alt="MindSpark AI" style="width: 80px; height: 80px; object-contain: contain;">
          </div>
          <h2 style="color: #00d8ff; font-size: 24px; font-weight: 700; margin-bottom: 16px; text-align: center;">Appointment Confirmed</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hello ${name},</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Thank you so much for your interest in MindSpark AI! We have received your appointment request for an <strong>AI Audit</strong> and we are truly looking forward to working with you to ignite your brand's presence.</p>
          
          <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin-bottom: 32px; border: 1px solid #f3f4f6;">
            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 12px; margin-top: 0;">Session Details</h3>
            <p style="margin: 4px 0; font-size: 15px;"><strong>Date:</strong> ${new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 4px 0; font-size: 15px;"><strong>Time:</strong> ${time} (Eastern Time)</p>
            <p style="margin: 4px 0; font-size: 13px; color: #6b7280; font-style: italic;">Note: We are based on the East Coast. Your calendar invite will automatically adjust to your local time zone.</p>
            <p style="margin: 4px 0; font-size: 15px;"><strong>Contact Method:</strong> ${contactMethod}${contactMethod === 'Phone' ? ` (${phone})` : ''}</p>
          </div>

          ${platformLink ? `
          <div style="margin-bottom: 32px; text-align: center;">
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 16px;">To ensure we can start on time, please make sure you have ${contactMethod} ready to use:</p>
            <a href="${platformLink}" style="display: inline-block; background-color: #00d8ff; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">${platformAction}</a>
          </div>
          ` : ''}

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 32px;">We are excited to help you "Stop the Scroll" and start your journey with us. If you need to reschedule or have any questions before our meeting, simply reply to this email.</p>
          
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;">
          
          <div style="text-align: center; color: #9ca3af; font-size: 14px;">
            <p style="margin-bottom: 4px;"><strong>MindSpark AI</strong></p>
            <p style="margin-top: 0;">Stop the Scroll. Spark the Obsession.</p>
          </div>
        </div>
      `;

      // Send to User
      await sendEmail(client, email, "Appointment Confirmation: Your AI Audit with MindSpark AI", userMailBody);
      
      // Send Notification to Owner
      const ownerEmail = process.env.OWNER_EMAIL || "brentplascencia@gmail.com";
      const ownerMailBody = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #fdfdfd; color: #1f2937;">
          <h2 style="color: #00d8ff; font-size: 20px; font-weight: 700; margin-bottom: 24px;">New AI Audit Booking</h2>
          
          <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
            <p style="margin: 8px 0; font-size: 15px;"><strong>Source:</strong> MindSpark Website</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Client Name:</strong> ${name}</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Client Email:</strong> ${email}</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Scheduled Date:</strong> ${date}</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Scheduled Time:</strong> ${time} (Eastern Time)</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Contact Method:</strong> ${contactMethod}</p>
            ${contactMethod === 'Phone' ? `<p style="margin: 8px 0; font-size: 15px;"><strong>Phone Number:</strong> ${phone}</p>` : ''}
          </div>

          <p style="font-size: 14px; color: #6b7280;">This event has been automatically added to your Google Calendar.</p>
        </div>
      `;
      await sendEmail(client, ownerEmail, `MindSpark Website: New Booking from ${name}`, ownerMailBody);

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error booking event:", error);
      const details = error.response?.data?.error?.message || error.message || "Unknown error";
      res.status(500).json({ 
        error: "Failed to book appointment", 
        details: details 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
