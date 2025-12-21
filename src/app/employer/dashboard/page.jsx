'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { db } from '../../../../config/firebase-client';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { 
  LayoutDashboard, Search, Briefcase, Settings, 
  LogOut, Plus, Users, Sparkles, Building2, 
  MapPin, Globe, ExternalLink 
} from 'lucide-react';

export default function EmployerDashboard() {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar - High Contrast Professional */}
      <aside className="w-72 bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen text-slate-300">
        <div className="p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">P</div>
            <span className="text-white font-bold text-xl tracking-tight">Panda Talent</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Search size={20} />} label="AI Talent Search" />
          <NavItem icon={<Briefcase size={20} />} label="My Projects" />
          <NavItem icon={<Users size={20} />} label="Shortlist" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link href="/employer/onboarding" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-sm">
            <Settings size={20} />
            <span>Edit Profile</span>
          </Link>
          <button onClick={logout} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all text-sm w-full">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Interface */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {profile?.entityType === 'company' ? 'Organization' : 'Project'} Overview
            </h1>
            <p className="text-slate-500 font-medium mt-1">Manage your hiring and AI-matched talent.</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-600/20 active:scale-95">
            <Plus size={20} className="mr-2" /> Post New Role
          </button>
        </header>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="AI Matches" value="24" sub="Highly relevant to your stack" icon={<Sparkles className="text-blue-600" />} />
          <StatCard label="Active Requests" value="3" sub="Viewing 12 candidates" icon={<Briefcase className="text-purple-600" />} />
          <StatCard label="Total Views" value="842" sub="+12% from last week" icon={<Users className="text-emerald-600" />} />
        </div>

        {/* Main Profile Info Card */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                <Building2 size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{profile?.organizationName}</h2>
                <div className="flex items-center space-x-3 text-sm text-slate-500 mt-1">
                  <span className="flex items-center"><MapPin size={14} className="mr-1"/> {profile?.location}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="flex items-center lowercase"><Globe size={14} className="mr-1"/> {profile?.industry}</span>
                </div>
              </div>
            </div>
            <Link href="/employer/onboarding" className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all">
              Edit Details
            </Link>
          </div>
          
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Mission & Bio</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {profile?.mission || "No mission statement added yet."}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.techStack?.map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold border border-slate-200/50">
                    {tag}
                  </span>
                )) || <span className="text-slate-400">No tech stack listed.</span>}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <Link href={profile?.website || '#'} target="_blank" className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-blue-600 transition-all">
                  Visit Project Website <ExternalLink size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Helper Components
function NavItem({ icon, label, active = false }) {
  return (
    <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-slate-800'
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-4xl font-black text-slate-900 tracking-tight mb-1">{value}</p>
      <p className="text-sm font-bold text-slate-900 mb-1">{label}</p>
      <p className="text-xs text-slate-400 font-medium">{sub}</p>
    </div>
  );
}