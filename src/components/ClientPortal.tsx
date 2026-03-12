import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, storage } from '../../firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, CheckCircle, AlertCircle, Loader2, Lock, Image as ImageIcon } from 'lucide-react';

export const ClientPortal = () => {
  const { portalId } = useParams();
  const [portal, setPortal] = useState<any>(null);
  const [accessCode, setAccessCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [instructions, setInstructions] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortal = async () => {
      if (!portalId) return;
      try {
        const docRef = doc(db, 'portals', portalId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Check expiration
          if (new Date(data.expiresAt) < new Date()) {
            setError('This portal has expired.');
          } else {
            setPortal(data);
          }
        } else {
          setError('Portal not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load portal.');
      } finally {
        setLoading(false);
      }
    };
    fetchPortal();
  }, [portalId]);

  const handleVerifyCode = () => {
    if (accessCode === portal?.accessCode) {
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Invalid access code.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one photo.');
      return;
    }
    setUploading(true);
    setError('');
    
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      const folderPath = `uploads/${portal.clientName}/${dateStr}`;
      const fileUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `${folderPath}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        fileUrls.push(url);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      // Save metadata to Firestore
      await addDoc(collection(db, 'uploads'), {
        portalId,
        clientName: portal.clientName,
        specialInstructions: instructions,
        fileUrls,
        folderPath,
        createdAt: serverTimestamp(),
      });

      // Notify owner via backend
      await fetch('/api/notify-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: portal.clientName,
          instructions,
          fileCount: files.length,
          folderPath
        }),
      });

      setCompleted(true);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan animate-spin" />
      </div>
    );
  }

  if (error && !portal) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-6 text-center">
        <div className="glass p-8 rounded-2xl max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-magenta mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={() => window.location.href = '/'} className="btn-primary w-full">Return Home</button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl max-w-md w-full border border-white/10"
        >
          <div className="w-16 h-16 bg-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-cyan" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Secure Client Portal</h2>
          <p className="text-gray-400 text-center mb-8">Please enter the access code provided during your consultation.</p>
          
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Enter Access Code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan transition-colors text-center text-xl tracking-widest uppercase"
            />
            {error && <p className="text-magenta text-sm text-center">{error}</p>}
            <button 
              onClick={handleVerifyCode}
              className="btn-primary w-full py-4 text-lg font-bold"
            >
              Access Portal
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-12 rounded-3xl max-w-lg w-full border border-cyan/20"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Upload Successful!</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Thank you, {portal.clientName}. We've received your photos and instructions. 
            Our team will begin the 24-hour turnaround process immediately.
          </p>
          <div className="bg-white/5 rounded-xl p-4 mb-8 text-left">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Summary</p>
            <p className="text-white">Files Uploaded: {files.length}</p>
            <p className="text-white">Project: {portal.clientName} AI Restoration</p>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-cyan hover:underline font-medium">Return to MindSpark AI</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {portal.clientName}</h1>
            <p className="text-gray-400">Secure Photo Upload Portal</p>
          </div>
          <div className="bg-cyan/10 px-4 py-2 rounded-full border border-cyan/20">
            <span className="text-cyan text-sm font-medium">Session Active</span>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Upload Section */}
          <div className="glass p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan" />
              Source Photos
            </h3>
            
            <div 
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                files.length > 0 ? 'border-cyan bg-cyan/5' : 'border-white/10 hover:border-cyan/50'
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files) setFiles(Array.from(e.dataTransfer.files));
              }}
            >
              <input 
                type="file" 
                multiple 
                id="file-upload" 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/*"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                {files.length > 0 ? (
                  <div>
                    <p className="text-xl font-bold text-cyan">{files.length} Files Selected</p>
                    <p className="text-gray-400 mt-2">Click or drag to replace</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xl font-bold">Drag & Drop Photos</p>
                    <p className="text-gray-400 mt-2">or click to browse high-resolution files</p>
                  </div>
                )}
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-6 grid grid-cols-4 gap-4">
                {files.slice(0, 4).map((f, i) => (
                  <div key={i} className="aspect-square bg-white/5 rounded-lg flex items-center justify-center text-[10px] text-gray-500 p-2 text-center overflow-hidden">
                    {f.name}
                  </div>
                ))}
                {files.length > 4 && (
                  <div className="aspect-square bg-white/5 rounded-lg flex items-center justify-center text-sm text-cyan font-bold">
                    +{files.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Instructions Section */}
          <div className="glass p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold mb-6">Special Instructions</h3>
            <textarea 
              placeholder="e.g., Specific colors for restoration, outfit preferences for headshots, or background details..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 h-40 focus:outline-none focus:border-cyan transition-colors resize-none"
            />
          </div>

          {/* Submit Section */}
          <div className="flex flex-col items-center">
            {error && <p className="text-magenta mb-4 font-medium">{error}</p>}
            
            {uploading ? (
              <div className="w-full space-y-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-cyan shadow-[0_0_15px_rgba(0,216,255,0.5)]"
                  />
                </div>
                <p className="text-center text-gray-400 font-medium animate-pulse">
                  Uploading High-Resolution Assets... {uploadProgress}%
                </p>
              </div>
            ) : (
              <button 
                onClick={handleUpload}
                disabled={files.length === 0}
                className={`btn-primary w-full py-5 text-xl font-bold shadow-xl ${
                  files.length === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''
                }`}
              >
                Start 24-Hour Turnaround
              </button>
            )}
            <p className="text-gray-500 text-sm mt-6 flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Secure SSL Encrypted Upload
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
