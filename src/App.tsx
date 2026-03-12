import { motion } from "motion/react";
import { Sparkles, Instagram, Facebook, Video, Home, MessageSquare, Mic, ArrowRight, X, CheckCircle2, Calendar, Clock, ChevronDown, Globe, Users } from "lucide-react";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { ClientPortal } from "./components/ClientPortal";
import { AdminDashboard } from "./components/AdminDashboard";

// --- Components ---

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <img 
    src="https://lh3.googleusercontent.com/d/1EIouJiPfVcHynVoi5BKGv-HrfwC62FjJ" 
    alt="MindSpark AI Logo" 
    className={`${className} object-contain`}
    referrerPolicy="no-referrer"
  />
);

const AboutUsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-navy/90 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass w-full max-w-2xl p-8 md:p-12 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg border border-white/20">
              <Logo className="w-full h-full" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20">
              <Sparkles className="w-4 h-4 text-cyan" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan">About MindSpark AI</span>
            </div>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
            Presence, Connection, and Impact
          </h2>

          <div className="text-gray-400 leading-relaxed space-y-6 text-sm md:text-base">
            <p>
              At MindSpark, we help businesses and individuals stand out in today’s digital world through intelligent, modern solutions that drive visibility, credibility, and growth. We create and manage social media content that builds your brand, increases recognition, and keeps you consistently seen by the right audience. Our AI-powered real estate staging transforms properties into high-impact visuals that attract buyers faster. We also design modern, high-performance websites enhanced with custom chatbots and live support, ensuring your customers are engaged and supported around the clock.
            </p>
            <p>
              In addition, our AI photography services bring images to life. We restore and rejuvenate old photos by removing cracks, repairing distortion, and reviving detail — preserving your memories for generations. We also create professional business portraits for platforms like LinkedIn to strengthen your professional presence, as well as elegant glamour and family photography that captures meaningful moments and lasting memories. At MindSpark, we don’t just create visuals and technology — we create presence, connection, and impact.
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="btn-primary w-full mt-8"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Navbar = ({ onBook, onAboutUs }: { onBook: () => void; onAboutUs: () => void }) => (
  <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center glass m-4 max-w-[calc(100%-2rem)] mx-auto">
    <div className="flex items-center gap-3">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan via-purple to-magenta rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white p-1 rounded-xl shadow-lg border border-white/20 flex items-center justify-center">
          <Logo className="w-8 h-8" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-display font-bold text-xl tracking-tight hidden sm:inline text-white leading-none">MindSpark <span className="text-cyan text-glow">AI</span></span>
        <span className="text-[8px] uppercase tracking-[0.2em] text-gray-500 hidden sm:inline">Ignite the Obsession</span>
      </div>
    </div>
    <div className="hidden md:flex gap-8 text-sm font-medium">
      <button onClick={onAboutUs} className="hover:text-cyan transition-colors">About Us</button>
      <a href="#services" className="hover:text-cyan transition-colors">Services</a>
      <a href="#demo" className="hover:text-cyan transition-colors">Agent Demo</a>
      <a href="#services" className="hover:text-cyan transition-colors">Web Design</a>
      <a href="#real-estate" className="hover:text-cyan transition-colors">Real Estate</a>
      <a href="https://mindspark-identity-services-1097932806516.us-west1.run.app/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition-colors">More MindSpark</a>
    </div>
    <button onClick={onBook} className="btn-primary !py-2 !px-6 !text-sm">Book Your AI Audit</button>
  </nav>
);

const CaseStudiesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-navy/90 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 md:p-12 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 mb-4">
            <Sparkles className="w-4 h-4 text-cyan" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan">Case Study: The 3-Second Rule</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
            Winning the Millisecond War
          </h2>

          <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed space-y-6">
            <p>
              In the digital landscape, you don’t have minutes to make an impression—you have milliseconds. 
              Research from the Nielsen Norman Group and Google indicates that users form an aesthetic opinion of a website in just <strong>50 milliseconds (0.05 seconds)</strong>, 
              and up to 55% of visitors spend fewer than 15 seconds actively engaging with a page before moving on.
            </p>
            
            <p>
              This phenomenon, often called the <strong>"3-Second Rule,"</strong> is rooted in our brain’s survival instinct: the amygdala constantly filters out "predictable" data to save energy. 
              If a viewer isn't immediately met with a pattern break—something that triggers a high-arousal emotion like surprise, curiosity, or awe—their brain classifies the content as "noise" and triggers the thumb to scroll.
            </p>

            <p>
              For a brand like MindSpark AI, capturing this window is essential; by using vibrant geometric visuals and interactive AI elements, you bypass the logical filter and hit the emotional center of the brain directly. 
              This releases dopamine, a neurotransmitter associated with reward and learning, which effectively "locks" the viewer’s attention and transforms a fleeting glance into a lasting engagement.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4 text-white">Why "The Spark" Matters for Your Business</h3>
            <p className="text-gray-400 text-sm mb-8">
              To keep viewers attached to futuremindspark.net, your design needs to act as a visual hook. Since you offer content creation for TikTok and IG, you are essentially selling the ability to win this "3-second war" for other companies.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-cyan">Factor</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-magenta">The "Ruthless Scroll"</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-emerald">The "MindSpark" Solution</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-white/5">
                    <td className="py-6 px-4 font-bold">First Impression</td>
                    <td className="py-6 px-4 text-gray-400">Generic stock photos or text-heavy headers.</td>
                    <td className="py-6 px-4 text-white font-medium">Vibrant, geometric "Brain Spark" visuals that signal innovation.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-6 px-4 font-bold">Initial Hook</td>
                    <td className="py-6 px-4 text-gray-400">"We offer social media services."</td>
                    <td className="py-6 px-4 text-white font-medium">"Is your brand invisible? We ignite the scroll-stop."</td>
                  </tr>
                  <tr>
                    <td className="py-6 px-4 font-bold">Engagement</td>
                    <td className="py-6 px-4 text-gray-400">Static pages with no interaction.</td>
                    <td className="py-6 px-4 text-white font-medium">24/7 Voice & Chat Agents that turn a passive visitor into an active participant.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Hero = ({ onBook, onViewCaseStudies }: { onBook: () => void; onViewCaseStudies: () => void }) => (
  <section className="relative pt-32 pb-20 px-6 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple/20 blur-[120px] rounded-full" />
    </div>
    
    <div className="max-w-7xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-sm mx-auto"
      >
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 border border-white/20 shadow-lg">
          <Logo className="w-full h-full" />
        </div>
        <span className="text-xs font-bold tracking-widest uppercase text-cyan">The Future of AI is Here</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <span className="text-2xl md:text-3xl font-display font-black italic uppercase tracking-tighter text-white/90">
          Stop the Scroll. <span className="text-cyan text-glow">Spark the Obsession.</span>
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Ignite Your Brand with the <br />
          <span className="gradient-text">Spark of Artificial Intelligence</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-10">
          Scaling your presence on Instagram, TikTok, and Facebook while automating customer engagement 24/7 with custom voice and chat agents.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onBook} className="btn-primary">Book Your AI Audit</button>
          <button 
            onClick={onViewCaseStudies}
            className="px-8 py-4 rounded-full font-bold border border-white/20 hover:bg-white/5 transition-all"
          >
            View Case Studies
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', date: '', time: '', contactMethod: 'Google Meet', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-close success message after 2 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleClose = () => {
    onClose();
    // Reset state after animation
    setTimeout(() => {
      setSuccess(false);
      setError(null);
      setStep(1);
      setFormData({ name: '', email: '', date: '', time: '', contactMethod: 'Google Meet', phone: '' });
    }, 300);
  };

  const handleBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        const errorMsg = data.details ? `${data.error}: ${data.details}` : (data.error || 'Failed to book. Please try again or contact support.');
        setError(errorMsg);
      }
    } catch (err) {
      console.error(err);
      setError('A connection error occurred. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass w-full max-w-md p-8 relative"
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-500 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">Submitted Successfully!</h2>
            <p className="text-gray-400 mb-8">
              Your AI Audit request has been sent. We've sent a confirmation to {formData.email}.
            </p>
            <button onClick={handleClose} className="btn-primary w-full mb-4">Done</button>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Closing in 2 seconds...</div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Book Your AI Audit</h2>
            
            <div className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}
              
              {step === 1 ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan text-navy font-bold"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan text-navy font-bold"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <button 
                    disabled={!formData.name || !formData.email}
                    onClick={() => setStep(2)} 
                    className="btn-primary w-full mt-4 disabled:opacity-50"
                  >
                    Next Step
                  </button>
                </>
              ) : step === 2 ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Preferred Contact Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Google Meet', 'Zoom', 'Microsoft Teams', 'Phone'].map((method) => (
                        <button
                          key={method}
                          onClick={() => setFormData({ ...formData, contactMethod: method })}
                          className={`px-4 py-3 rounded-lg border text-sm transition-all ${
                            formData.contactMethod === method 
                              ? 'bg-cyan/20 border-cyan text-white shadow-[0_0_15px_rgba(0,216,255,0.3)]' 
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.contactMethod === 'Phone' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-4"
                    >
                      <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full bg-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan text-navy font-bold"
                        placeholder="(555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </motion.div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all">Back</button>
                    <button 
                      disabled={formData.contactMethod === 'Phone' && !formData.phone}
                      onClick={() => setStep(3)} 
                      className="flex-[2] btn-primary disabled:opacity-50"
                    >
                      Next Step
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-1">
                        <Calendar className="w-4 h-4 text-white" />
                        Date
                      </label>
                      <input 
                        type="date" 
                        className="w-full bg-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan text-sm text-navy font-bold"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-1">
                        <Clock className="w-4 h-4 text-white" />
                        Time (Eastern)
                      </label>
                      <input 
                        type="time" 
                        className="w-full bg-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan text-sm text-navy font-bold"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setStep(2)} className="flex-1 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all">Back</button>
                    <button 
                      disabled={!formData.date || !formData.time || loading}
                      onClick={handleBook} 
                      className="flex-[2] btn-primary disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Confirm Booking'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

const ServiceCard = ({ icon: Icon, title, description, features, onBook }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass p-8 flex flex-col h-full"
  >
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center mb-6 border border-cyan/30">
      <Icon className="text-cyan w-6 h-6" />
    </div>
    <h3 className="font-display text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-400 mb-6 flex-grow">{description}</p>
    <ul className="space-y-3 mb-8">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
          <div className="spark-node" />
          {f}
        </li>
      ))}
    </ul>
    <button onClick={onBook} className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 hover:border-cyan/50 transition-all text-sm font-bold">
      Book Your AI Audit
    </button>
  </motion.div>
);

const Services = ({ onBook }: { onBook: () => void }) => (
  <section id="services" className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-4xl font-bold mb-4">Our Service Pillars</h2>
        <p className="text-gray-400">Comprehensive AI solutions for the modern enterprise.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ServiceCard 
          icon={Video}
          title="Social Media Mastery"
          description="Professional content creation and strategic posting across all major platforms."
          features={["AI-Driven Content Strategy", "Automated Posting Schedules", "Engagement Optimization"]}
          onBook={onBook}
        />
        <ServiceCard 
          icon={Home}
          title="Real Estate AI Staging"
          description="Transform property listings with high-end AI-generated imagery and virtual staging."
          features={["Virtual Furniture Placement", "Lighting Enhancement", "Faster Sales Cycles"]}
          onBook={onBook}
        />
        <ServiceCard 
          icon={MessageSquare}
          title="24/7 AI Automations"
          description="Custom-built websites featuring integrated Voice Agents and Chatbots."
          features={["Multimodal Live Support", "Lead Generation Bots", "Automated Appointment Booking"]}
          onBook={onBook}
        />
        <ServiceCard 
          icon={Globe}
          title="AI-Optimized Digital Presence/Web Design"
          description="Strategic, high-performance web builds designed to act as your 24/7 digital storefront."
          features={[
            "Conversion-First Landing Pages",
            "Interactive Single-Page Sites",
            "Dynamic UI/UX for AI Agents"
          ]}
          onBook={onBook}
        />
      </div>
    </div>
  </section>
);

const BeforeAfterSlider = ({ onBook }: { onBook: () => void }) => {
  const [sliderPos, setSliderPos] = useState(50);
  // Using the user's provided Google Drive images for the "Before" and "After" states
  const beforeImage = "https://lh3.googleusercontent.com/d/153sKioeTDmySyBxHeRWBMqCGeSTeVi9x"; 
  const afterImage = "https://lh3.googleusercontent.com/d/1BV7zzR-gaxiDJpEg7Ig52_iBJLpZpLnG";
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  };

  return (
    <section id="real-estate" className="py-20 px-6 bg-navy-light/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-4xl font-bold mb-6">Real Estate AI Staging</h2>
            <p className="text-gray-400 text-lg mb-8">
              We transform property listings with <strong>"The Canvas"</strong> and <strong>"The Connection."</strong> Sell homes faster with virtual staging that looks indistinguishable from reality.
            </p>
            <div className="flex gap-4">
              <button onClick={onBook} className="btn-primary">Book Your AI Audit</button>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-2xl overflow-hidden">
            <div className="mb-6 flex justify-between items-end">
              <div className="transition-all duration-300" style={{ opacity: sliderPos > 20 ? 1 : 0.3 }}>
                <h3 className="text-4xl font-serif text-navy leading-none">The Canvas</h3>
                <p className="text-navy/40 text-xs mt-1 font-bold uppercase tracking-widest">Vacant Listing</p>
              </div>
              <div className="text-right transition-all duration-300" style={{ opacity: sliderPos < 80 ? 1 : 0.3 }}>
                <h3 className="text-4xl font-serif text-navy leading-none">The Connection</h3>
                <p className="text-navy/40 text-xs mt-1 font-bold uppercase tracking-widest">MindSpark Staging</p>
              </div>
            </div>
            
            <div 
              ref={containerRef}
              className="relative h-[400px] rounded-xl overflow-hidden cursor-ew-resize select-none border border-black/5"
              onMouseMove={handleMove}
              onTouchMove={handleMove}
            >
              {/* After Image */}
              <img 
                src={afterImage} 
                className="absolute inset-0 w-full h-full object-cover"
                alt="After Staging"
                referrerPolicy="no-referrer"
              />
              {/* Before Image */}
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img 
                  src={beforeImage} 
                  className="absolute inset-0 w-[100vw] lg:w-[600px] h-full object-cover"
                  alt="Before Staging"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Quote Overlay for After Image */}
              <div 
                className="absolute bottom-6 right-6 z-20 pointer-events-none transition-opacity duration-300"
                style={{ opacity: sliderPos < 40 ? 1 : 0 }}
              >
                <p className="text-white text-sm font-serif italic drop-shadow-lg">"Buyers can now visualize living here."</p>
              </div>

              {/* Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white z-10"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-navy/20 rounded-full" />
                    <div className="w-1 h-4 bg-navy/20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-navy/40">Before</span>
              <span className="text-cyan">Staged by AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const VoiceAgentDemo = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Ready to talk");
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const stopAllAudio = () => {
    audioSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    audioSourcesRef.current = [];
    nextStartTimeRef.current = 0;
  };

  const startConversation = async () => {
    try {
      setIsRecording(true);
      setStatus("Connecting...");
      
      // Initialize AudioContext on user gesture
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      sessionRef.current = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: `You are the "Spark Agent," the lead AI consultant for MindSpark AI. Your goal is to convert visitors into clients by explaining our premium AI visual services.
          
          COMPANY INFO:
          - Name: MindSpark AI
          - Owner: Brent (brentplascencia@gmail.com)
          - Mission: Ignite brands with AI-driven content and automation.
          
          KEY SERVICE KNOWLEDGE:
          1. Cinemagraphic Ambiance: We don't just edit photos; we breathe life into them. We add realistic, burning flames to indoor fireplaces and outdoor fire pits to create emotional warmth.
          2. Fluid Motion Pools: We transform static backyard photos into immersive videos by adding full-motion water ripples to pools.
          3. Virtual Twilight Mastery: We use "Day-to-Dusk" processing to show properties during the golden hour, including simulated architectural and landscape lighting.
          4. Precision Virtual Remodeling: We provide front and backyard renovations using the exact dimensions of the property for 100% architectural accuracy.
          5. Social Media Mastery: Scaling presence on Instagram, TikTok, and Facebook.
          
          PRICING:
          - Starter ($450/mo): 12 social posts, community management, monthly report, 2 platforms, 48h turnaround.
          - Growth ($800/mo): 20 social posts, 4 reels/TikToks, community management, bi-weekly report, 24h turnaround.
          - Premium ($1000/mo): Daily content, 8 reels/TikToks, full management, weekly strategy calls, priority turnaround.
          
          TONE & STRATEGY:
          - Use the "3-Second Rule" logic: Remind clients that viewers scroll past static images, but "moving" elements like fire and water lock attention and trigger dopamine.
          - Always offer to "Spark a Demo" for their specific property.
          - Focus on converting visitors into booking an AI Audit.
          - Keep responses concise and engaging.`,
        },
        callbacks: {
          onopen: () => {
            setStatus("Listening...");
            startMic();
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.interrupted) {
              stopAllAudio();
              setStatus("Listening...");
              return;
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setStatus("Speaking...");
              playAudio(base64Audio);
            }
          },
          onclose: () => {
            stopMic();
            stopAllAudio();
            setIsRecording(false);
            setStatus("Ready to talk");
          }
        }
      });
    } catch (err) {
      console.error(err);
      setStatus("Error connecting");
      setIsRecording(false);
    }
  };

  const startMic = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!audioContextRef.current) return;
      
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        sessionRef.current?.sendRealtimeInput({
          media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };
    } catch (err) {
      console.error("Mic error:", err);
      setStatus("Mic access denied");
    }
  };

  const stopMic = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  const playAudio = async (base64: string) => {
    if (!audioContextRef.current) return;

    try {
      const binary = atob(base64);
      const buffer = new Int16Array(binary.length / 2);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      
      const view = new DataView(bytes.buffer);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = view.getInt16(i * 2, true);
      }

      const float32Data = new Float32Array(buffer.length);
      for (let i = 0; i < buffer.length; i++) {
        float32Data[i] = buffer[i] / 32768.0;
      }

      // Gemini 2.5 Flash Native Audio usually outputs at 24kHz
      const audioBuffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      const now = audioContextRef.current.currentTime;
      if (nextStartTimeRef.current < now) {
        nextStartTimeRef.current = now + 0.05;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;
      audioSourcesRef.current.push(source);

      source.onended = () => {
        audioSourcesRef.current = audioSourcesRef.current.filter(s => s !== source);
        if (audioSourcesRef.current.length === 0) {
          setStatus("Listening...");
        }
      };
    } catch (e) {
      console.error("Playback error:", e);
    }
  };

  return (
    <section id="demo" className="py-20 px-6">
      <div className="max-w-4xl mx-auto glass p-12 text-center relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan/10 blur-[80px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple/10 blur-[80px] rounded-full" />
        
        <h2 className="font-display text-4xl font-bold mb-6">Experience the MindSpark Agent</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Our voice agents don't just follow scripts—they understand context. Tap below to have a real-time conversation with our AI lead.
        </p>

        <div className="flex flex-col items-center gap-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={isRecording ? () => sessionRef.current?.close() : startConversation}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-magenta shadow-[0_0_30px_rgba(255,0,255,0.5)]' : 'bg-cyan shadow-[0_0_30px_rgba(0,245,255,0.5)]'}`}
          >
            {isRecording ? <div className="w-8 h-8 bg-white rounded-sm" /> : <Mic className="text-navy w-10 h-10" />}
          </motion.button>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium uppercase tracking-widest text-gray-500">{status}</span>
            {isRecording && (
              <div className="flex gap-1 h-4 items-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 16, 4] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-1 bg-cyan rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ onBook }: { onBook: () => void }) => {
  const [activeTab, setActiveTab] = useState<'social' | 'real-estate'>('real-estate');

  const socialPlans = [
    {
      name: "Starter",
      price: "450",
      description: "Small Businesses",
      features: ["12 Social Posts/mo", "Community Management", "Monthly Report", "For 2 platforms"],
      turnaround: "48 hours",
      buttonText: "Choose Starter",
      popular: false
    },
    {
      name: "Growth",
      price: "800",
      description: "Growing Brands",
      features: ["20 Social Posts/mo", "4 Reels/TikToks", "Community Management", "Bi-weekly Report"],
      turnaround: "24 hours",
      buttonText: "Choose Growth",
      popular: true
    },
    {
      name: "Premium",
      price: "1000",
      description: "Established Companies",
      features: ["Daily Content", "8 Reels/TikToks", "Full Management", "Weekly Strategy Calls"],
      turnaround: "Priority",
      buttonText: "Choose Premium",
      popular: false
    }
  ];

  const realEstatePlans = [
    {
      name: "The Listing Boost",
      price: "149",
      priceMax: "199",
      description: "Perfect for first-timers",
      features: ["5 High-Res Photos", "Core Rooms Focus", "MLS-Ready Shots", "Standard Turnaround"],
      turnaround: "48 hours",
      buttonText: "Boost My Listing",
      popular: false
    },
    {
      name: "The Model Home",
      price: "249",
      priceMax: "349",
      description: "Our most popular choice",
      features: ["10 High-Res Photos", "Full Home Coverage", "Design Flexibility", "Indistinguishable Reality"],
      turnaround: "24-48 hours",
      buttonText: "Get Best Value",
      popular: true
    },
    {
      name: "The Power Agent Plan",
      price: "899",
      priceMax: "1,199",
      isMonthly: true,
      description: "For high-volume teams",
      features: ["5 Listings Monthly", "Priority Speed", "Brand-Building Tool", "Dedicated Support"],
      turnaround: "Priority (24h)",
      buttonText: "Join Power Agents",
      popular: false
    }
  ];

  const plans = activeTab === 'social' ? socialPlans : realEstatePlans;

  return (
    <section id="pricing" className="py-24 px-6 bg-navy-light/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 text-lg mb-8">Scale your production without the overhead of an in-house team.</p>
          
          <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/10 mb-8">
            <button 
              onClick={() => setActiveTab('real-estate')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'real-estate' ? 'bg-cyan text-navy' : 'text-gray-400 hover:text-white'}`}
            >
              Real Estate Staging
            </button>
            <button 
              onClick={() => setActiveTab('social')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'social' ? 'bg-cyan text-navy' : 'text-gray-400 hover:text-white'}`}
            >
              Social Media
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan: any, i) => (
            <motion.div 
              key={`${activeTab}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-cyan bg-cyan/5' : 'border-white/10 bg-white/5'} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan text-navy px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${plan.price}{plan.priceMax ? `-${plan.priceMax}` : '.00'}</span>
                  {plan.isMonthly && <span className="text-gray-500">/mo</span>}
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-cyan" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="pt-6 border-t border-white/10 mb-8">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Turnaround</p>
                <p className="font-bold">{plan.turnaround}</p>
              </div>
              
              <button 
                onClick={onBook}
                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-cyan text-navy hover:bg-cyan-light' : 'bg-white/5 border border-white/20 hover:bg-white/10'}`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hi! I\'m C.J. How can I help you ignite your brand today?' }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      // Filter out the initial AI message to ensure the conversation starts with a user message
      // as required by the Gemini API for multi-turn chat.
      const history = messages.slice(1).map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...history, { role: 'user', parts: [{ text: userMsg.text }] }],
        config: {
          systemInstruction: `You are the "Spark Agent" (C.J.), the lead AI consultant for MindSpark AI. Your goal is to convert visitors into clients by explaining our premium AI visual services.
          
          COMPANY: MindSpark AI
          OWNER: Brent (brentp@futuremindspark.net)
          
          KEY SERVICE KNOWLEDGE:
          1. Cinemagraphic Ambiance: We don't just edit photos; we breathe life into them. We add realistic, burning flames to indoor fireplaces and outdoor fire pits to create emotional warmth.
          2. Fluid Motion Pools: We transform static backyard photos into immersive videos by adding full-motion water ripples to pools.
          3. Virtual Twilight Mastery: We use "Day-to-Dusk" processing to show properties during the golden hour, including simulated architectural and landscape lighting.
          4. Precision Virtual Remodeling: We provide front and backyard renovations using the exact dimensions of the property for 100% architectural accuracy.
          5. Social Media Mastery: Tailored content for personal brands, influencers, and startups. Delivery in 24-48h.
          
          REAL ESTATE STAGING PRICING:
          - The Listing Boost ($149-$199): Focus on core rooms (5 photos). Perfect for first-timers needing high-res, MLS-ready shots.
          - The Model Home ($249-$349): Most popular. 10 photos, design flexibility. Makes the entire home feel professionally staged.
          - The Power Agent Plan ($899-$1,199/mo): For teams. 5 listings monthly, priority speed. Brand-building tool for high-volume agents.
          
          SOCIAL MEDIA PRICING:
          - Starter ($450/mo): 12 posts, 2 platforms, 48h turnaround.
          - Growth ($800/mo): 20 posts, 4 reels, 24h turnaround.
          - Premium ($1000/mo): Daily content, 8 reels, priority turnaround.
          
          SALES LOGIC & UPSELL STRATEGY:
          - If a user asks about real estate staging pricing, refer to the three-tier system above.
          - If they mention a single property, suggest "The Model Home" for the best value.
          - If they are a busy agent or team, move them toward the "Power Agent Plan" for consistency and speed.
          - Use the "3-Second Rule" logic: Remind clients that viewers scroll past static images, but "moving" elements like fire and water lock attention and trigger dopamine.
          
          TONE & STRATEGY:
          - Always offer to "Spark a Demo" for their specific property.
          - Encourage users to "Book Your AI Audit" using the button on the site.
          - CONTACT CAPTURE: If a user prefers to just talk or has specific questions instead of filling out the "Book your AI Audit" form, you MUST politely ask for their name and either an email or phone number so Brent can follow up with them personally.
          - Be professional but energetic.`
        }
      });
      
      const aiText = response.text || "I'm having a little trouble connecting to my brain right now. Could you try that again?";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I hit a spark gap. My circuits are a bit overloaded. Try again in a moment?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass w-[350px] h-[500px] mb-4 flex flex-col overflow-hidden shadow-2xl border-white/20"
        >
          <div className="p-4 bg-gradient-to-r from-cyan to-purple flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1 border border-white/20 shadow-sm">
                <Logo className="w-full h-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-bold text-navy/60 leading-none mb-1">Live Support</span>
                <span className="font-bold leading-none">C.J.</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-navy/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-cyan text-navy rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white p-3 rounded-2xl rounded-tl-none text-xs flex gap-1">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-cyan rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-cyan rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-cyan rounded-full" />
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-white/10 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-grow bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-cyan"
            />
            <button 
              onClick={handleSend} 
              disabled={isTyping}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-navy transition-colors ${isTyping ? 'bg-gray-600' : 'bg-cyan'}`}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center hover:scale-110 transition-transform overflow-hidden p-3 border-2 border-white/20"
      >
        <Logo className="w-full h-full" />
      </button>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What type of content do you create?",
      answer: "We specialize in tailored content for personal brands, influencers, startups, and creators looking to build a unique online presence."
    },
    {
      question: "How long does a typical content creation project take?",
      answer: "Timelines vary based on complexity, but most social media content projects are delivered within 24-48 hours. Larger strategy or automation projects typically take 1-2 weeks."
    },
    {
      question: "Will my content be optimized for social media?",
      answer: "Absolutely. Every piece of content is engineered specifically for the platform it's intended for, utilizing current algorithm trends, optimal aspect ratios, and engaging hooks."
    },
    {
      question: "Can you refresh my existing content?",
      answer: "Yes! We can take your raw footage, old posts, or long-form videos and repurpose them into high-impact short-form content and modern graphics."
    },
    {
      question: "Do you offer ongoing content management or support?",
      answer: "We offer comprehensive monthly management plans that include strategy, creation, posting, and community engagement to keep your brand active 24/7."
    },
    {
      question: "What do you need from me to get started?",
      answer: "To begin, we just need a brief overview of your brand goals and any existing assets you have. Our AI Audit session is the perfect first step to align our vision."
    }
  ];

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">FAQs</h2>
          <h3 className="text-xl text-gray-400">Frequently Asked Questions</h3>
          <p className="text-gray-500 mt-4">Got questions? Here are answers to common queries before starting your creative journey with us.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-bold">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-cyan transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-6 text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12 px-6 border-t border-white/10">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 shadow-xl border border-white/20">
            <Logo className="w-full h-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-none">MindSpark AI</span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Stop the Scroll. Spark the Obsession.</span>
          </div>
        </div>
        <a href="mailto:brentp@futurespark.net" className="text-gray-400 hover:text-cyan transition-colors text-sm">
          brentp@futurespark.net
        </a>
        <button 
          onClick={() => {
            fetch('/api/auth/google/url')
              .then(res => res.json())
              .then(({ url }) => window.open(url, 'google_auth', 'width=600,height=700'));
          }}
          className="text-[10px] text-gray-500 hover:text-cyan transition-colors uppercase tracking-widest font-bold text-left mt-2"
        >
          Admin: Connect Calendar
        </button>
      </div>
      <div className="flex gap-6 text-gray-500 text-sm pt-2">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
      </div>
      <div className="flex gap-4 pt-2">
        <a 
          href="https://www.instagram.com/futuremindspark" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-cyan transition-colors"
        >
          <Instagram className="w-5 h-5" />
        </a>
        <Facebook className="w-5 h-5 text-gray-400 hover:text-cyan cursor-pointer" />
        <a 
          href="https://www.tiktok.com/@futuremindspark" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-5 h-5 fill-gray-400 group-hover:fill-cyan cursor-pointer transition-colors"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.16 1.02.16 2.12.87 2.89.69.78 1.71 1.15 2.73 1.01 1.03-.1 1.96-.73 2.47-1.67.47-.82.62-1.75.57-2.69.01-4.27-.01-8.53.01-12.8z"/>
          </svg>
        </a>
      </div>
    </div>
    <div className="text-center mt-8 text-gray-600 text-xs">
      © 2026 Future Mind Spark. All rights reserved.
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isCaseStudiesOpen, setIsCaseStudiesOpen] = useState(false);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  useEffect(() => {
    fetch('/api/calendar/status')
      .then(res => res.json())
      .then(data => setIsCalendarConnected(data.connected));

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setIsCalendarConnected(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectCalendar = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      if (!res.ok) throw new Error('Failed to get auth URL');
      const { url } = await res.json();
      if (!url) throw new Error('No URL returned from server');
      window.open(url, 'google_auth', 'width=600,height=700');
    } catch (err) {
      console.error('Calendar connection error:', err);
    }
  };

  return (
    <Routes>
      <Route path="/portal/:portalId" element={<ClientPortal />} />
      <Route path="/admin/portals" element={<AdminDashboard />} />
      <Route path="/" element={
        <div className="min-h-screen bg-navy selection:bg-cyan/30">
          <Navbar 
            onBook={() => setIsBookingOpen(true)} 
            onAboutUs={() => setIsAboutUsOpen(true)}
          />
          <main>
            <Hero 
              onBook={() => setIsBookingOpen(true)} 
              onViewCaseStudies={() => setIsCaseStudiesOpen(true)} 
            />
            <Services onBook={() => setIsBookingOpen(true)} />
            <BeforeAfterSlider onBook={() => setIsBookingOpen(true)} />
            <VoiceAgentDemo />
            <Pricing onBook={() => setIsBookingOpen(true)} />
            <FAQ />
          </main>
          <Footer />
          <Chatbot />
          <AboutUsModal isOpen={isAboutUsOpen} onClose={() => setIsAboutUsOpen(false)} />
          <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
          <CaseStudiesModal isOpen={isCaseStudiesOpen} onClose={() => setIsCaseStudiesOpen(false)} />
          
          {/* Admin Connection Helper (Only for Brent) */}
          <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
            <Link 
              to="/admin/portals"
              className="text-[10px] text-gray-400 hover:text-cyan transition-all uppercase tracking-widest font-bold flex items-center gap-2 bg-navy/40 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/5 hover:border-cyan/30"
            >
              <Users className="w-3 h-3" />
              Portal Admin
            </Link>
            <button 
              onClick={handleConnectCalendar}
              className="text-[10px] text-gray-400 hover:text-cyan transition-all uppercase tracking-widest font-bold flex items-center gap-2 bg-navy/40 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/5 hover:border-cyan/30"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isCalendarConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
              {isCalendarConnected ? 'Calendar Connected (Click to Reconnect)' : 'Connect Owner Calendar'}
            </button>
          </div>
        </div>
      } />
    </Routes>
  );
}
