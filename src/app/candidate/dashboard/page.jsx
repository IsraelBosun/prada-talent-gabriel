'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { db } from '../../../../config/firebase-client';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { 
  User, Code, Briefcase, MapPin, ExternalLink, 
  Edit3, Github, Linkedin, LayoutDashboard, 
  Settings, LogOut, Rocket, CheckCircle, ChevronRight, Menu, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CandidateDashboard() {
  const { currentUser, logout } = useAuth(); 
  const router = useRouter();
  
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile sidebar

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

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      router.push('/login');
    } catch (error) {
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      
      {/* --- MOBILE NAVIGATION (Top Bar) --- */}
      <div className="lg:hidden bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-gray-50 rounded-xl text-gray-600"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-white animate-in slide-in-from-top duration-300 p-8">
            <div className="flex justify-between items-center mb-10">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={24}/></button>
            </div>
            <nav className="space-y-4">
                <MobileNavItem icon={LayoutDashboard} label="Dashboard" active onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem icon={Briefcase} label="My Applications" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem icon={Rocket} label="Skill Assessment" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem icon={Settings} label="Settings" onClick={() => setIsMobileMenuOpen(false)} />
                <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-4 p-4 text-red-500 font-bold bg-red-50 rounded-2xl mt-10"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </nav>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">P</div>
          <span className="font-bold text-gray-900 tracking-tight text-xl">Panda</span>
        </div>
        <nav className="space-y-1 flex-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Briefcase} label="My Applications" />
          <NavItem icon={Rocket} label="Skill Assessment" />
          <NavItem icon={Settings} label="Settings" />
        </nav>
        <button 
          onClick={handleSignOut}
          className="flex items-center space-x-3 text-gray-400 hover:text-red-500 transition-all px-4 py-3 rounded-2xl hover:bg-red-50 mt-auto group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome, {profile?.fullName?.split(' ')[0] || 'User'} 👋
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

        {/* --- REST OF THE DASHBOARD GRID --- */}
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
                        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-blue-200 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{proj.name}</h4>
                                    {proj.link && (
                                        <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                </div>           
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{proj.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {proj.techStack?.map((t, i) => (
                                    <span key={i} className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter px-2 py-1 bg-gray-50 rounded-md">{t}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
          </div>
        </div>
      </main>

      {/* --- EDIT SLIDE-OVER (Existing code) --- */}
      {isEditing && (
        <div className="fixed inset-0 z-[200] flex justify-end bg-black/40 backdrop-blur-sm transition-all">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                {/* ... Edit form from your previous code ... */}
                <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
                    <div>
                      <h2 className="text-xl font-bold">Profile Settings</h2>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-widest text-blue-600">Update your brand</p>
                    </div>
                    <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <X size={24} />
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

function MobileNavItem({ icon: Icon, label, active = false, onClick }) {
    return (
      <div onClick={onClick} className={`flex items-center space-x-4 p-5 rounded-2xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-500'}`}>
        <Icon size={24} />
        <span className="text-lg font-bold">{label}</span>
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