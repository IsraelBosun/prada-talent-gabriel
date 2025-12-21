'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { db } from '../../../../config/firebase-client';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { 
  User, Code, Briefcase, Link as LinkIcon, MapPin, 
  CheckCircle2, ChevronRight, ChevronLeft, X, Plus 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CandidateOnboarding() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // --- Form State ---
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    city: '',
    bio: '',
    experience: '3-5',
    github: '',
    linkedin: ''
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [projects, setProjects] = useState([
    { id: Date.now(), name: '', description: '', techStack: [] }
  ]);

  // --- FIX: Strict Navigation Logic ---
  const nextStep = (e) => {
    if (e) e.preventDefault(); // Extra insurance against submission
    
    if (step === 1) {
      if (!formData.fullName || !formData.title || !formData.city) {
        return toast.error("Please fill in all identity fields");
      }
    }
    if (step === 2) {
      if (skills.length === 0) {
        return toast.error("Please add at least one skill");
      }
      if (!formData.bio) {
        return toast.error("Please write a short bio");
      }
    }
    
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
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = skillInput.trim().toLowerCase();
      if (val && !skills.includes(val)) {
        setSkills([...skills, val]);
        setSkillInput('');
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // --- Project Logic ---
  const addProject = () => setProjects([...projects, { id: Date.now(), name: '', description: '', techStack: [] }]);
  
  const removeProject = (id) => {
    if (projects.length > 1) setProjects(projects.filter(p => p.id !== id));
  };

  const updateProject = (id, field, value) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleProjectTechKeyDown = (e, projectId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = e.target.value.trim().toLowerCase();
      if (val) {
        setProjects(projects.map(p => {
          if (p.id === projectId && !p.techStack.includes(val)) {
            return { ...p, techStack: [...p.techStack, val] };
          }
          return p;
        }));
        e.target.value = '';
      }
    }
  };

  const removeProjectTech = (projectId, techName) => {
    setProjects(projects.map(p => p.id === projectId 
      ? { ...p, techStack: p.techStack.filter(t => t !== techName) } 
      : p
    ));
  };

  // --- Final Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) return; // Prevent submission if accidentally triggered on steps 1 or 2

    setLoading(true);
    try {
      const candidateProfile = {
        ...formData,
        skills,
        projects,
        userId: currentUser.uid,
        email: currentUser.email,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, "candidates", currentUser.uid), candidateProfile);
      await updateDoc(doc(db, "users", currentUser.uid), {
        onboardingCompleted: true,
        fullName: formData.fullName
      });

      toast.success("Profile indexed successfully!");
      router.push('/candidate/dashboard');
    } catch (error) {
      toast.error("Save failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Identity', icon: User },
    { id: 2, name: 'Expertise', icon: Code },
    { id: 3, name: 'Proof', icon: Briefcase }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-gray-50 border-b md:border-r border-gray-100 p-6 md:p-8 md:h-screen md:sticky md:top-0">
        <div className="flex items-center space-x-2 mb-8 md:mb-12">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
          <span className="font-bold text-gray-900 tracking-tight text-xl">Panda Talent</span>
        </div>
        <nav className="flex md:flex-col justify-between md:space-y-8">
          {steps.map((s) => (
            <div key={s.id} className="flex items-center">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 transition-all ${
                step >= s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border border-gray-200 text-gray-400'
              }`}>
                {step > s.id ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
              </div>
              <div className="hidden md:block">
                <p className={`text-[10px] font-bold tracking-widest uppercase ${step >= s.id ? 'text-blue-600' : 'text-gray-400'}`}>Step 0{s.id}</p>
                <p className={`font-semibold text-sm ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>{s.name}</p>
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center p-6 md:p-16 bg-white overflow-y-auto">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl py-8 space-y-8">
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Personal Details</h2>
                <p className="text-gray-500 mt-2">Introduce yourself to the network.</p>
              </header>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input name="fullName" type="text" value={formData.fullName} onChange={handleChange} placeholder="Jane Cooper" 
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                      <input name="city" type="text" value={formData.city} onChange={handleChange} placeholder="San Francisco, CA" 
                        className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Professional Title</label>
                  <input name="title" type="text" value={formData.title} onChange={handleChange} placeholder="Senior Fullstack Engineer" 
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Your Expertise</h2>
                <p className="text-gray-500 mt-2">Add your tech stack and experience.</p>
              </header>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Skills (Press Enter)</label>
                  <div className="w-full p-3 rounded-2xl bg-gray-50 min-h-[60px] flex flex-wrap gap-2 items-center">
                    {skills.map(s => (
                      <span key={s} className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 text-sm font-semibold text-blue-600 flex items-center shadow-sm">
                        {s} <X size={14} className="ml-2 cursor-pointer hover:text-red-500" onClick={() => removeSkill(s)} />
                      </span>
                    ))}
                    <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} placeholder="e.g. React"
                      className="bg-transparent border-none focus:ring-0 outline-none flex-1 min-w-[120px] text-sm py-2 px-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Bio</label>
                  <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} placeholder="Describe your tech journey..." 
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <header>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Featured Projects</h2>
                <p className="text-gray-500 mt-2">Highlight your best work.</p>
              </header>
              <div className="space-y-10">
                {projects.map((proj) => (
                  <div key={proj.id} className="relative p-6 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/30 space-y-4">
                    <button type="button" onClick={() => removeProject(proj.id)} className="absolute -top-3 -right-3 bg-white border border-gray-100 p-1.5 rounded-full text-gray-400 hover:text-red-500 shadow-sm z-10">
                      <X size={16} />
                    </button>
                    <div className="space-y-4">
                      <input placeholder="Project Name" className="w-full bg-transparent text-xl font-bold text-gray-800 outline-none border-b border-transparent focus:border-blue-100 pb-1"
                        value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} />
                      <textarea placeholder="Description..." className="w-full bg-transparent text-sm text-gray-500 outline-none resize-none" rows="2"
                        value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} />
                      <div className="flex flex-wrap gap-2 items-center pt-2">
                        {proj.techStack.map(t => (
                          <span key={t} className="bg-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-gray-100 text-gray-600 flex items-center shadow-sm">
                            {t} <X size={10} className="ml-1.5 cursor-pointer" onClick={() => removeProjectTech(proj.id, t)} />
                          </span>
                        ))}
                        <input placeholder="+ Add Tech" className="text-[10px] uppercase font-bold tracking-widest outline-none bg-transparent w-32"
                          onKeyDown={(e) => handleProjectTechKeyDown(e, proj.id)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addProject} className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50/30 transition-all font-bold flex items-center justify-center space-x-2">
                  <Plus size={18} /> <span>Add Another Project</span>
                </button>
              </div>
            </div>
          )}

          {/* FIX: Navigation Footer with explicit button types */}
          <footer className="flex items-center justify-between pt-8 border-t border-gray-100 sticky bottom-0 bg-white pb-4 z-20">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="flex items-center text-gray-400 font-bold hover:text-gray-900">
                <ChevronLeft size={20} className="mr-1" /> Back
              </button>
            ) : <div />}

            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-gray-300">Page {step} of 3</span>
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 flex items-center shadow-xl shadow-gray-200">
                  Continue <ChevronRight size={18} className="ml-2" />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 flex items-center shadow-xl shadow-blue-100 disabled:opacity-50 transition-all">
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