import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { motion } from 'motion/react';
import { Plus, Link as LinkIcon, Copy, Check, Trash2, Users, Clock, ShieldCheck, Lock } from 'lucide-react';

export const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [clientName, setClientName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [portals, setPortals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && (u.email === 'brentp@futuremindspark.net' || u.email === 'brentplascencia@gmail.com')) {
        fetchPortals();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchPortals = async () => {
    try {
      const q = query(collection(db, 'portals'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setPortals(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching portals:', err);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleCreatePortal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !accessCode) return;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    await addDoc(collection(db, 'portals'), {
      clientName,
      accessCode: accessCode.toUpperCase(),
      expiresAt: expiresAt.toISOString(),
      status: 'active',
      createdAt: serverTimestamp(),
    });

    setClientName('');
    setAccessCode('');
    fetchPortals();
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/portal/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <div className="min-h-screen bg-navy flex items-center justify-center"><Clock className="animate-spin text-cyan" /></div>;

  if (!user || (user.email !== 'brentp@futuremindspark.net' && user.email !== 'brentplascencia@gmail.com')) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-6">
        <div className="glass p-8 rounded-2xl max-w-md w-full text-center">
          <ShieldCheck className="w-12 h-12 text-magenta mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Admin Access Only</h2>
          <p className="text-gray-400 mb-8">Please sign in with your authorized MindSpark AI account.</p>
          <button onClick={handleLogin} className="btn-primary w-full">Sign In with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">Portal Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">{user.email}</span>
            <button onClick={() => auth.signOut()} className="text-magenta text-sm hover:underline">Sign Out</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="glass p-6 rounded-2xl border border-white/10 h-fit">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan" />
              New Client Portal
            </h3>
            <form onSubmit={handleCreatePortal} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 mb-1 block">Client Name</label>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan"
                  placeholder="e.g. John Smith"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 mb-1 block">Access Code</label>
                <input 
                  type="text" 
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan uppercase"
                  placeholder="e.g. SPARK2024"
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3 mt-4">Generate Secure Link</button>
              <p className="text-[10px] text-gray-500 text-center mt-2 italic">Links expire automatically after 48 hours.</p>
            </form>
          </div>

          {/* List */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan" />
              Active Portals
            </h3>
            {portals.map((portal) => (
              <motion.div 
                key={portal.id}
                layout
                className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-lg">{portal.clientName}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                      new Date(portal.expiresAt) > new Date() ? 'bg-emerald-500/20 text-emerald-500' : 'bg-magenta/20 text-magenta'
                    }`}>
                      {new Date(portal.expiresAt) > new Date() ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> {portal.accessCode}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Exp: {new Date(portal.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => copyLink(portal.id)}
                    className="p-3 bg-white/5 rounded-xl hover:bg-cyan/20 hover:text-cyan transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    {copiedId === portal.id ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                    {copiedId === portal.id ? 'Copied' : 'Copy Link'}
                  </button>
                </div>
              </motion.div>
            ))}
            {portals.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-gray-500">No portals generated yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
