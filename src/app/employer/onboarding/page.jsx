'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { db } from '../../../../config/firebase-client';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { 
  Building2, User, Globe, Target, Rocket, MapPin,
  CheckCircle2, ChevronRight, ChevronLeft, X, Plus, Users 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployerOnboarding() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [entityType, setEntityType] = useState('company'); // 'company' or 'individual'

  // --- Form State ---
  const [formData, setFormData] = useState({
    organizationName: '',
    website: '',
    industry: '',
    size: '1-10',
    location: '',
    mission: '',
    linkedIn: ''
  });

  // --- Tech Stack Tags ---
  const [stack, setStack] = useState([]);
  const [stackInput, setStackInput] = useState('');

  const nextStep = (e) => {
    if (e) e.preventDefault();
    if (step === 1 && !formData.organizationName) return toast.error("Please enter a name");
    setStep((s) => s + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = (e) => {
    if (e) e.preventDefault();
    setStep((s) => s - 1);
    window.scrollTo(0, 0);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- Tag Logic ---
  const handleStackKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = stackInput.trim().toLowerCase();
      if (val && !stack.includes(val)) {
        setStack([...stack, val]);
        setStackInput('');
      }
    }
  };

  const removeStack = (tagToRemove) => setStack(stack.filter(t => t !== tagToRemove));

  // --- Final Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const employerProfile = {
        ...formData,
        entityType,
        techStack: stack,
        userId: currentUser.uid,
        email: currentUser.email,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, "employers", currentUser.uid), employerProfile);
      await updateDoc(doc(db, "users", currentUser.uid), {
        onboardingCompleted: true,
        organizationName: formData.organizationName
      });

      toast.success("Hiring profile created!");
      router.push('/employer/dashboard');
    } catch (error) {
      toast.error("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Identity', icon: Building2 },
    { id: 2, name: 'Stack', icon: Rocket },
    { id: 3, name: 'Mission', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Sidebar Progress */}
      <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 p-8 flex flex-col justify-between md:h-screen md:sticky md:top-0 text-white">
        <div>
          <div className="flex items-center space-x-2 mb-12">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="font-bold tracking-tight text-xl">Panda Talent</span>
          </div>
          <nav className="flex md:flex-col justify-between md:space-y-10">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all ${
                  step >= s.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-500'
                }`}>
                  {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                </div>
                <div className="hidden md:block">
                  <p className={`text-[10px] font-bold tracking-widest uppercase ${step >= s.id ? 'text-blue-400' : 'text-slate-500'}`}>Step 0{s.id}</p>
                  <p className={`font-semibold text-sm ${step >= s.id ? 'text-white' : 'text-slate-500'}`}>{s.name}</p>
                </div>
              </div>
            ))}
          </nav>
        </div>
        <div className="hidden md:block p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
          <p className="text-xs text-slate-400 leading-relaxed">
            Profiling your {entityType} helps our AI find candidates who align with your engineering culture.
          </p>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex justify-center p-6 md:p-16 bg-white overflow-y-auto">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl py-8 space-y-10">
          
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Setup your hiring profile</h2>
                <p className="text-slate-500 mt-2 text-lg">Are you hiring as a company or for a personal project?</p>
              </header>

              {/* Entity Toggle */}
              <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 rounded-2xl">
                <button type="button" onClick={() => setEntityType('company')}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${entityType === 'company' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
                  Company
                </button>
                <button type="button" onClick={() => setEntityType('individual')}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${entityType === 'individual' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
                  Individual / Founder
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    {entityType === 'company' ? 'Company Name' : 'Project Name'}
                  </label>
                  <input name="organizationName" type="text" value={formData.organizationName} onChange={handleChange} required
                    placeholder={entityType === 'company' ? 'PandaTech Inc.' : 'My Solo Startup'}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Website / URL</label>
                    <div className="relative">
                      <Globe className="absolute left-5 top-4 text-slate-400" size={18} />
                      <input name="website" type="url" value={formData.website} onChange={handleChange}
                        placeholder="https://panda.io" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Location / HQ</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-4 text-slate-400" size={18} />
                      <input name="location" type="text" value={formData.location} onChange={handleChange}
                        placeholder="Lagos, Nigeria" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Tech Ecosystem</h2>
                <p className="text-slate-500 mt-2 text-lg">What does your current {entityType === 'company' ? 'engineering stack' : 'project'} look like?</p>
              </header>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Core Tech Stack (Press Enter)</label>
                  <div className="w-full p-4 rounded-2xl bg-slate-50 min-h-[80px] flex flex-wrap gap-3 items-center border-2 border-transparent focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    {stack.map(tag => (
                      <span key={tag} className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-slate-700 flex items-center shadow-sm border border-slate-100">
                        {tag} <X size={14} className="ml-2 cursor-pointer hover:text-red-500" onClick={() => removeStack(tag)} />
                      </span>
                    ))}
                    <input value={stackInput} onChange={(e) => setStackInput(e.target.value)} onKeyDown={handleStackKeyDown}
                      placeholder={stack.length === 0 ? "e.g. Next.js, FastAPI, AWS" : "Add more..."}
                      className="bg-transparent border-none focus:ring-0 outline-none flex-1 min-w-[150px] text-sm font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Industry / Niche</label>
                  <input name="industry" type="text" value={formData.industry} onChange={handleChange}
                    placeholder="e.g. FinTech, Artificial Intelligence, SaaS"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">The Mission</h2>
                <p className="text-slate-500 mt-2 text-lg">Describe the problems you are solving.</p>
              </header>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    {entityType === 'company' ? 'Company Bio' : 'Project Vision'}
                  </label>
                  <textarea name="mission" rows="6" value={formData.mission} onChange={handleChange} required
                    placeholder="We are building the future of..."
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Company/Personal LinkedIn</label>
                  <input name="linkedIn" type="url" value={formData.linkedIn} onChange={handleChange}
                    placeholder="linkedin.com/company/panda"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
            </div>
          )}

          {/* Nav Footer */}
          <footer className="flex items-center justify-between pt-10 border-t border-slate-100 sticky bottom-0 bg-white pb-6 z-20">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="flex items-center text-slate-400 font-bold hover:text-slate-900 transition-colors">
                <ChevronLeft size={20} className="mr-2" /> Back
              </button>
            ) : <div />}

            <div className="flex items-center space-x-6">
              <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">Step {step} / 3</span>
              {step < 3 ? (
                <button type="button" onClick={nextStep}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center shadow-2xl shadow-slate-200">
                  Continue <ChevronRight size={18} className="ml-2" />
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Complete Profile'} <CheckCircle2 size={18} className="ml-2" />
                </button>
              )}
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}