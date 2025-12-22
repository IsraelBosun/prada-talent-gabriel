'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { db } from '../../../../config/firebase-client';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { 
    LayoutDashboard, Search, Briefcase, Settings, 
    LogOut, Plus, Users, Sparkles, Building2, 
    MapPin, Globe, ExternalLink, ArrowRight, X, Loader2, Github, Linkedin, Menu
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployerDashboard() {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // AI Search State
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Candidate Detail Modal State
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser?.uid) {
        try {
          const docRef = doc(db, "employers", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchLoading(true);
    try {
      const response = await fetch('/api/search-talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 6 }),
      });
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.matches);
      }
    } catch (error) {
      toast.error("AI matching engine is busy. Try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row relative">
      
      {/* --- MOBILE NAVIGATION --- */}
      <div className="lg:hidden bg-white-900 px-6 py-4 sticky top-0 z-40 flex items-center justify-between text-white">

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-800 rounded-xl text-white"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-slate-900 text-white animate-in slide-in-from-top duration-300 p-8 flex flex-col">
            <div className="flex justify-between items-center mb-10">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-800 rounded-full"><X size={24}/></button>
            </div>
            <nav className="space-y-4 flex-1">
                <MobileNavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} />
                <MobileNavItem icon={Search} label="AI Talent Search" active={activeTab === 'search'} onClick={() => { setActiveTab('search'); setIsMobileMenuOpen(false); }} />
                <MobileNavItem icon={Briefcase} label="My Projects" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem icon={Users} label="Shortlist" onClick={() => setIsMobileMenuOpen(false)} />
            </nav>
            <button onClick={logout} className="flex items-center space-x-4 p-5 text-red-400 font-bold bg-red-500/10 rounded-2xl mb-4">
                <LogOut size={20} />
                <span>Sign Out</span>
            </button>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-72 bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen text-slate-300 z-20">
        <div className="p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">P</div>
            <span className="text-white font-bold text-xl tracking-tight">Panda Talent</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('search')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === 'search' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-slate-800'}`}>
            <Search size={20} /> <span>AI Talent Search</span>
          </button>
          <NavItem icon={<Briefcase size={20} />} label="My Projects" />
          <NavItem icon={<Users size={20} />} label="Shortlist" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link href="/employer/onboarding" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-sm">
            <Settings size={20} /> <span>Edit Profile</span>
          </Link>
          <button onClick={logout} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all text-sm w-full font-bold">
            <LogOut size={20} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto z-10">
        {activeTab === 'dashboard' ? (
          <div className="animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {profile?.entityType === 'company' ? 'Organization' : 'Project'} Overview
                </h1>
                <p className="text-slate-500 font-medium mt-1">Total indexed talent amount: 2,400+</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-600/20">
                <Plus size={20} className="mr-2" /> Post New Role
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard label="AI Matches" value="24" sub="Highly relevant to your stack" icon={<Sparkles className="text-blue-600" />} />
              <StatCard label="Active Requests" value="3" sub="Viewing 12 candidates" icon={<Briefcase className="text-purple-600" />} />
              <StatCard label="Total Views" value="842" sub="+12% from last week" icon={<Users className="text-emerald-600" />} />
            </div>

            <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-10">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-slate-900">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400"><Building2 size={32} /></div>
                  <div>
                    <h2 className="text-xl font-bold">{profile?.organizationName}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mt-1">
                      <span className="font-bold text-blue-600 lowercase tracking-wider">{profile?.industry}</span>
                      <span className="hidden sm:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>{profile?.location}</span>
                    </div>
                  </div>
                </div>
                <Link href="/employer/onboarding" className="text-sm font-bold text-blue-600 bg-blue-50 px-5 py-2.5 rounded-xl">Edit Profile</Link>
              </div>
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Mission</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{profile?.mission || "No mission added."}</p>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.techStack?.map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-200/50">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-10 duration-500">
            <header className="mb-10 text-slate-900">
              <h2 className="text-4xl font-black tracking-tight flex items-center gap-3">
                <Sparkles className="text-blue-600" /> AI Talent Scout
              </h2>
              <p className="text-slate-500 text-lg mt-2 font-medium">Find the perfect tech match for your specific task or role.</p>
            </header>

            <form onSubmit={handleSearch} className="mb-12">
              <div className="relative group">
                <Search className="absolute left-6 top-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={24} />
                <input 
                  type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Someone to build a real-time crypto wallet dashboard with React and WebSockets"
                  className="w-full pl-16 pr-4 pr-4 py-6 rounded-[2rem] bg-white shadow-xl shadow-blue-900/5 border-none focus:ring-2 focus:ring-blue-600 outline-none text-lg font-medium text-slate-900 md:pr-40"
                />
                <button type="submit" disabled={searchLoading} className="mt-4 w-full md:mt-0 md:absolute md:right-3 md:top-3 md:bottom-3 md:w-auto bg-blue-600 text-white px-8 py-4 md:py-0 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  {searchLoading ? <Loader2 className="animate-spin" size={20} /> : "Match Talent"}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResults.map((candidate) => (
                <div key={candidate.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl">{candidate.fullName?.charAt(0)}</div>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">{candidate.score}% Match</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{candidate.fullName}</h3>
                  <p className="text-sm font-semibold text-blue-600 mb-4">{candidate.title}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {candidate.skills?.split(',').slice(0, 4).map((skill, i) => (
                      <span key={i} className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">{skill}</span>
                    ))}
                  </div>
                  <button 
                    onClick={() => { setSelectedCandidateId(candidate.id); setIsModalOpen(true); }}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    Profile Details <ArrowRight size={18} />
                  </button>
                </div>
              ))}
              {!searchLoading && searchResults.length === 0 && (
                <div className="col-span-full py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                  <Sparkles className="mx-auto text-slate-300 mb-4" size={48} />
                  <p className="text-slate-400 font-bold text-lg">Your AI matches will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- CANDIDATE DETAIL SLIDE-OVER MODAL --- */}
      <CandidateDetailModal 
        candidateId={selectedCandidateId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

/* --- THE SLIDE-OVER COMPONENT --- */
function CandidateDetailModal({ candidateId, isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && candidateId) {
      const fetchFull = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, "candidates", candidateId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setData(docSnap.data());
        } catch (e) { toast.error("Failed to load profile."); }
        finally { setLoading(false); }
      };
      fetchFull();
    }
  }, [isOpen, candidateId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500">
        
        <header className="sticky top-0 bg-white/90 backdrop-blur-md p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center z-20">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full self-start sm:self-auto"><X size={24} className="text-slate-500" /></button>
          <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200">Shortlist Talent</button>
        </header>

        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : (
          <div className="p-6 md:p-12 space-y-12 text-slate-900">
            <section>
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center text-4xl font-black mb-8 shadow-inner">{data?.fullName?.charAt(0)}</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">{data?.fullName}</h2>
              <p className="text-xl md:text-2xl font-bold text-blue-600 mt-2">{data?.title}</p>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 text-slate-400 font-bold text-sm tracking-wide">
                <span className="flex items-center gap-2"><MapPin size={18}/> {data?.city}</span>
                <span className="flex items-center gap-2"><Briefcase size={18}/> {data?.experience} Exp.</span>
              </div>
            </section>

            <section className="bg-slate-50 p-6 md:p-10 rounded-[2.5rem] border border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 text-center sm:text-left">Professional Bio</h3>
              <p className="text-slate-800 leading-relaxed font-medium text-lg md:text-xl italic">"{data?.bio}"</p>
            </section>

            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-center md:text-left">Tech Stack</h3>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {data?.skills?.map(skill => (
                  <span key={skill} className="px-4 py-2 md:px-5 md:py-2.5 bg-white border-2 border-slate-100 rounded-2xl text-xs md:text-sm font-bold text-slate-800 shadow-sm hover:border-blue-200 transition-colors uppercase tracking-widest">{skill}</span>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 text-center sm:text-left">Portfolio Proof</h3>
              {data?.projects?.map((proj, i) => (
                <div key={i} className="p-6 md:p-8 rounded-[2rem] border-2 border-slate-50 bg-white hover:border-blue-50 transition-all space-y-4 shadow-sm">
                  <h4 className="text-xl md:text-2xl font-bold tracking-tight">{proj.name}</h4>
                  <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {proj.techStack?.map(t => (
                      <span key={t} className="text-[10px] font-black uppercase tracking-tighter text-blue-600 bg-blue-50/50 px-3 py-1 rounded-lg border border-blue-100/20">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <footer className="pt-12 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12">
              <Link href={data?.github || '#'} target="_blank" className="flex items-center justify-center gap-3 py-4 md:py-5 bg-slate-900 text-white rounded-3xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"><Github size={20} /> GitHub</Link>
              <Link href={data?.linkedin || '#'} target="_blank" className="flex items-center justify-center gap-3 py-4 md:py-5 border-2 border-slate-100 rounded-3xl font-bold hover:bg-slate-50 transition-all text-slate-900"><Linkedin size={20} /> LinkedIn</Link>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- HELPER SUB-COMPONENTS --- */
function NavItem({ icon, label }) {
  return (
    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold hover:bg-slate-800 text-slate-400">
      {icon} <span>{label}</span>
    </button>
  );
}

function MobileNavItem({ icon: Icon, label, active = false, onClick }) {
    return (
      <div onClick={onClick} className={`flex items-center space-x-4 p-5 rounded-2xl cursor-pointer transition-all ${active ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400'}`}>
        <Icon size={24} />
        <span className="text-lg font-bold">{label}</span>
      </div>
    );
}

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/5 text-slate-900">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">{icon}</div>
      <p className="text-4xl md:text-5xl font-black tracking-tighter mb-1">{value}</p>
      <p className="text-sm font-bold">{label}</p>
      <p className="text-xs text-slate-400 font-medium">{sub}</p>
    </div>
  );
}