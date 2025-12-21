'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { db } from '../../../../config/firebase-client';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // Added for redirect
import { 
  User, Code, Briefcase, MapPin, ExternalLink, 
  Edit3, Github, Linkedin, LayoutDashboard, 
  Settings, LogOut, Rocket, CheckCircle, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CandidateDashboard() {
  // 1. Extract logout from your Auth Context
  const { currentUser, logout } = useAuth(); 
  const router = useRouter();
  
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) return;
      try {
        const docRef = doc(db, "candidates", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [currentUser]);

  // --- Sign Out Logic ---
  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      router.push('/login'); // Or your home/auth page
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Error signing out");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await updateDoc(doc(db, "candidates", currentUser.uid), profile);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-blue-600 font-bold tracking-widest uppercase text-xs">Loading Panda Engine...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* --- SLEEK SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center space-x-2 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
          <span className="font-bold text-xl tracking-tight text-gray-900">Panda Talent</span>
        </div>
        
        <nav className="space-y-1 flex-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Briefcase} label="My Applications" />
          <NavItem icon={Rocket} label="Skill Assessment" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        {/* --- Updated Sign Out Button --- */}
        <button 
          onClick={handleSignOut}
          className="flex items-center space-x-3 text-gray-400 hover:text-red-500 transition-all px-4 py-3 rounded-2xl hover:bg-red-50 mt-auto group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, {profile?.fullName?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="text-gray-500">Your profile is currently live to recruiters.</p>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm group"
          >
            <Edit3 size={18} className="mr-2 group-hover:text-blue-600" /> Edit Profile
          </button>
        </header>

        {/* --- DASHBOARD GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />
                <div className="relative">
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Identity</h3>
                    <h2 className="text-2xl font-bold text-gray-900">{profile?.fullName}</h2>
                    <p className="text-gray-600 font-medium mb-4">{profile?.title}</p>
                    <div className="flex items-center text-gray-400 text-sm mb-6">
                        <MapPin size={16} className="mr-1" /> {profile?.city}
                    </div>
                    <div className="flex space-x-3">
                        <SocialBtn icon={Github} link={profile?.github} />
                        <SocialBtn icon={Linkedin} link={profile?.linkedin} />
                    </div>
                </div>
            </section>

            <section className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-100">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-6">Core Expertise</h3>
                <div className="flex flex-wrap gap-2">
                    {profile?.skills?.map((skill, idx) => (
                        <span key={idx} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors">
                            {skill}
                        </span>
                    ))}
                </div>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Professional Story</h3>
                <p className="text-gray-700 leading-relaxed text-lg italic">"{profile?.bio}"</p>
            </section>

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Featured Proof</h3>
                    <span className="text-xs font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-full">{profile?.projects?.length || 0} Projects</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile?.projects?.map((proj, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-blue-200 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{proj.name}</h4>
                                <ExternalLink size={18} className="text-gray-300" />
                            </div>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{proj.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {proj.techStack?.map((t, i) => (
                                    <span key={i} className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
          </div>
        </div>
      </main>

      {/* --- EDIT SLIDE-OVER --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-all">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
                    <div>
                      <h2 className="text-xl font-bold">Profile Settings</h2>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Update your brand</p>
                    </div>
                    <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <ChevronRight size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleUpdate} className="p-8 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Full Name</label>
                          <input className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                                 value={profile.fullName} 
                                 onChange={(e) => setProfile({...profile, fullName: e.target.value})} />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Job Title</label>
                          <input className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                                 value={profile.title} 
                                 onChange={(e) => setProfile({...profile, title: e.target.value})} />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Professional Bio</label>
                          <textarea className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 outline-none h-40 resize-none transition-all" 
                                 value={profile.bio} 
                                 onChange={(e) => setProfile({...profile, bio: e.target.value})} />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" disabled={saveLoading} className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50">
                            {saveLoading ? 'Syncing...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

// --- HELPER COMPONENTS ---
function NavItem({ icon: Icon, label, active = false }) {
  return (
    <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}>
      <Icon size={20} className={active ? 'text-blue-600' : 'text-gray-400'} />
      <span className={`text-sm font-bold ${active ? 'text-blue-600' : ''}`}>{label}</span>
    </div>
  );
}

function SocialBtn({ icon: Icon, link }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all">
      <Icon size={18} />
    </a>
  );
}