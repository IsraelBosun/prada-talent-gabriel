// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import { useAuth } from '@/context/AuthProvider';
// import { db } from '../../../../config/firebase-client';
// import { doc, updateDoc, setDoc } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import { 
//   User, Code, Briefcase, Link as LinkIcon, MapPin, 
//   CheckCircle2, ChevronRight, ChevronLeft, X, Plus, ChevronDown, Search
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// // 1. Comprehensive Tech Stack List
// const TECH_STACK_OPTIONS = [
//   "React", "Next.js", "Vue.js", "Angular", "Svelte", "Tailwind CSS", "TypeScript", "JavaScript",
//   "Node.js", "Python", "Django", "Flask", "Go", "Rust", "Java", "Spring Boot", "Ruby on Rails",
//   "PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase", "Supabase", "Prisma",
//   "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform",
//   "React Native", "Flutter", "Swift", "Kotlin", "Unity",
//   "Figma", "Adobe XD", "Sketch", "GraphQL", "REST API", "WebSockets",
//   "OpenAI", "PyTorch", "TensorFlow", "Pandas", "Scikit-learn"
// ];

// const TECH_ROLES = [
//   "Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile Developer", 
//   "iOS Developer", "Android Developer", "DevOps Engineer", "Cloud Architect", 
//   "Data Scientist", "Data Engineer", "AI/ML Engineer", "Security Engineer",
//   "UI Designer", "UX Designer", "Product Designer", "UX Researcher",
//   "Product Manager", "Technical Product Manager", "Project Manager", "Scrum Master",
//   "QA Engineer", "Automation Engineer", "Embedded Systems Engineer", "Blockchain Developer",
//   "Site Reliability Engineer (SRE)", "Game Developer", "AR/VR Developer"
// ];

// export default function CandidateOnboarding() {
//   const { currentUser } = useAuth();
//   const router = useRouter();
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
  
//   // Dropdown Refs & States
//   const titleDropdownRef = useRef(null);
//   const skillDropdownRef = useRef(null);
//   const [showTitleDropdown, setShowTitleDropdown] = useState(false);
//   const [showSkillDropdown, setShowSkillDropdown] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     title: '',
//     city: '',
//     bio: '',
//     experience: '3-5',
//     github: '',
//     linkedin: ''
//   });

//   const [skills, setSkills] = useState([]);
//   const [skillInput, setSkillInput] = useState('');
//   const [projects, setProjects] = useState([
//     { id: Date.now(), name: '', description: '', techStack: [], link: '' }
//   ]);

//   // Click Outside Detection
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (titleDropdownRef.current && !titleDropdownRef.current.contains(event.target)) setShowTitleDropdown(false);
//       if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target)) setShowSkillDropdown(false);
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   // --- Skill Logic ---
//   const addSkill = (skill) => {
//     const val = skill.trim();
//     if (val && !skills.includes(val)) {
//       setSkills([...skills, val]);
//     }
//     setSkillInput('');
//     setShowSkillDropdown(false);
//   };

//   const handleSkillKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       e.stopPropagation();
//       if (skillInput.trim()) {
//         addSkill(skillInput.trim());
//       }
//     }
//   };

//   const removeSkill = (skillToRemove) => setSkills(skills.filter(s => s !== skillToRemove));

//   const filteredSkillsList = TECH_STACK_OPTIONS.filter(s => 
//     s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s)
//   );

//   // --- Navigation & Submit (Existing Logic) ---
//   const nextStep = (e) => {
//     if (e) e.preventDefault();
//     if (step === 1 && (!formData.fullName || !formData.title || !formData.city)) return toast.error("Please fill in all identity fields");
//     if (step === 2 && (skills.length === 0 || !formData.bio)) return toast.error("Please add skills and a bio");
//     setStep((s) => s + 1);
//     window.scrollTo(0, 0);
//   };

//   const prevStep = (e) => {
//     if (e) e.preventDefault();
//     setStep((s) => s - 1);
//     window.scrollTo(0, 0);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const candidateProfile = { ...formData, skills, projects, userId: currentUser.uid, email: currentUser.email, updatedAt: new Date().toISOString() };
//       await setDoc(doc(db, "candidates", currentUser.uid), candidateProfile);
//       await updateDoc(doc(db, "users", currentUser.uid), { onboardingCompleted: true, fullName: formData.fullName });
//       await fetch('/api/index-candidate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(candidateProfile) });
//       toast.success("Profile indexed by AI!");
//       router.push('/candidate/dashboard');
//     } catch (error) { toast.error("Error during setup"); } 
//     finally { setLoading(false); }
//   };

//   const steps = [
//     { id: 1, name: 'Identity', icon: User },
//     { id: 2, name: 'Expertise', icon: Code },
//     { id: 3, name: 'Proof', icon: Briefcase }
//   ];


//   // --- Project Management Logic ---
//   const addProject = () => {
//     setProjects([...projects, { id: Date.now(), name: '', description: '', techStack: [], link: '' }]);
//   };

//   const removeProject = (id) => {
//     // Prevent removing if only one project remains
//     if (projects.length > 1) {
//       setProjects(projects.filter(p => p.id !== id));
//     } else {
//       toast.error("At least one project is required.");
//     }
//   };

//   const updateProject = (id, field, value) => {
//     setProjects(projects.map(p => 
//       p.id === id ? { ...p, [field]: value } : p
//     ));
//   };


//  return (
//     <div className="min-h-screen bg-white flex flex-col md:flex-row">
//       {/* Sidebar */}
//       <div className="w-full md:w-80 bg-gray-50 border-b md:border-r border-gray-200 p-6 md:p-8 md:h-screen md:sticky md:top-20">
//         <nav className="flex md:flex-col justify-between md:space-y-8">
//           {steps.map((s) => (
//             <div key={s.id} className="flex items-center">
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all ${step >= s.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-400'}`}>
//                 {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
//               </div>
//               <div className="hidden md:block">
//                 <p className={`text-[10px] font-bold tracking-widest uppercase ${step >= s.id ? 'text-blue-600' : 'text-gray-400'}`}>Step 0{s.id}</p>
//                 <p className={`font-bold text-sm ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>{s.name}</p>
//               </div>
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex justify-center p-6 md:p-16 bg-white overflow-y-auto">
//         <form onSubmit={handleSubmit} className="w-full max-w-2xl py-8 space-y-12">
          
//           {step === 1 && (
//             <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <header>
//                 <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">Personal Details</h2>
//                 <p className="text-gray-500 mt-2 text-lg">Define your professional identity.</p>
//               </header>
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
//                     <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Jane Cooper" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-medium text-gray-900" />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
//                     <div className="relative">
//                       <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
//                       <input name="city" value={formData.city} onChange={handleChange} placeholder="Lagos, Nigeria" className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-medium text-gray-900" />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-2 relative" ref={titleDropdownRef}>
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Professional Title</label>
//                   <div className="relative">
//                     <input value={formData.title} onFocus={() => setShowTitleDropdown(true)} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior Backend Engineer" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-bold text-gray-900" />
//                     <ChevronDown className="absolute right-4 top-4 text-gray-400" size={20} />
//                   </div>
//                   {showTitleDropdown && (
//                     <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2 animate-in zoom-in-95">
//                       {TECH_ROLES.filter(r => r.toLowerCase().includes(formData.title.toLowerCase())).map(role => (
//                         <button key={role} type="button" onClick={() => { setFormData({...formData, title: role}); setShowTitleDropdown(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 font-bold transition-all">{role}</button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {step === 2 && (
//             <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <header>
//                 <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">Your Expertise</h2>
//                 <p className="text-gray-500 mt-2 text-lg">What powers your workflow?</p>
//               </header>
//               <div className="space-y-6">
//                 <div className="space-y-2 relative" ref={skillDropdownRef}>
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Skills & Tools</label>
//                   <div className="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 min-h-[70px] flex flex-wrap gap-2 items-center focus-within:bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/5 transition-all">
//                     {skills.map(s => (
//                       <span key={s} className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-blue-600 flex items-center shadow-sm uppercase tracking-wider">
//                         {s} <X size={14} className="ml-2 cursor-pointer hover:text-red-500" onClick={() => removeSkill(s)} />
//                       </span>
//                     ))}
//                     <input value={skillInput} onFocus={() => setShowSkillDropdown(true)} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} placeholder="Search stack..." className="bg-transparent border-none focus:ring-0 outline-none flex-1 min-w-[120px] text-sm py-2 px-2 font-medium" />
//                   </div>
//                   {showSkillDropdown && (
//                     <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2 animate-in zoom-in-95">
//                       {TECH_STACK_OPTIONS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s)).map(skill => (
//                         <button key={skill} type="button" onClick={() => addSkill(skill)} className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 font-bold transition-all flex justify-between">{skill} <Plus size={16} /></button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bio</label>
//                   <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} placeholder="Describe your tech journey..." className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-medium text-gray-900 resize-none" />
//                 </div>
//               </div>
//             </div>
//           )}

//           {step === 3 && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
//               <header>
//                 <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">Featured Projects</h2>
//                 <p className="text-gray-500 mt-2 text-lg">Prove your expertise through action.</p>
//               </header>

//               <div className="space-y-8">
//                 {projects.map((proj) => (
//                   <div key={proj.id} className="relative p-8 rounded-[2.5rem] border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-100 transition-all group">
//                     <button type="button" onClick={() => removeProject(proj.id)} className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors">
//                       <X size={18} />
//                     </button>

//                     <div className="space-y-6">
//                       <div className="space-y-2">
//                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Project Name</label>
//                         <input placeholder="e.g. AI-Powered CRM" className="w-full bg-gray-50 px-5 py-4 rounded-2xl text-xl font-bold text-gray-800 outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white border border-gray-100 focus:border-blue-600 transition-all"
//                           value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} />
//                       </div>
//                       <div className="space-y-2">
//                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
//                         <textarea placeholder="The problem you solved and the tech used..." className="w-full bg-gray-50 px-5 py-4 rounded-2xl text-base text-gray-600 outline-none resize-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white border border-gray-100 focus:border-blue-600 transition-all" rows="3"
//                           value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} />
//                       </div>
//                       <div className="space-y-2">
//                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Project Stack</label>
//                         <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100 min-h-[58px]">
//                           {proj.techStack.map(t => (
//                             <span key={t} className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-bold text-blue-600 uppercase flex items-center shadow-sm">
//                               {t} <X size={10} className="ml-1.5 cursor-pointer" onClick={() => {
//                                 setProjects(projects.map(p => p.id === proj.id ? { ...p, techStack: p.techStack.filter(st => st !== t) } : p));
//                               }} />
//                             </span>
//                           ))}
//                           <input placeholder="+ Add Tech" className="text-xs font-bold text-gray-700 outline-none bg-transparent px-2 w-28"
//                             onKeyDown={(e) => {
//                               if (e.key === 'Enter') {
//                                 e.preventDefault();
//                                 const val = e.target.value.trim().toLowerCase();
//                                 if (val) {
//                                   updateProject(proj.id, 'techStack', [...proj.techStack, val]);
//                                   e.target.value = '';
//                                 }
//                               }
//                             }} 
//                           />
//                         </div>
//                       </div>
//                       {/* Project Link - NEW FIELD */}
//                       <div className="space-y-2">
//                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Live Link / Repository (Optional)</label>
//                         <div className="relative">
//                           <LinkIcon className="absolute left-4 top-4 text-gray-400" size={18} />
//                           <input 
//                             placeholder="https://github.com/yourproject" 
//                             className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-medium text-gray-900"
//                             value={proj.link} 
//                             onChange={(e) => updateProject(proj.id, 'link', e.target.value)} 
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 <button type="button" onClick={addProject} className="w-full py-8 rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-500 hover:text-blue-600 hover:bg-blue-50/30 hover:border-blue-200 transition-all font-bold flex flex-col items-center justify-center space-y-2 group">
//                   <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-blue-200"><Plus size={24} /></div>
//                   <span className="text-lg">Add Another Project</span>
//                 </button>
//               </div>
//             </div>
//           )}

//           <footer className="flex items-center justify-between pt-8 border-t border-gray-100 sticky bottom-0 bg-white pb-4 z-20">
//             {step > 1 ? (
//               <button type="button" onClick={prevStep} className="flex items-center text-gray-400 font-bold hover:text-gray-900 transition-colors">
//                 <ChevronLeft size={20} className="mr-1" /> Back
//               </button>
//             ) : <div />}
//             <div className="flex items-center space-x-4">
//               <span className="text-xs font-bold text-gray-300">Page {step} of 3</span>
//               {step < 3 ? (
//                 <button type="button" onClick={nextStep} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 flex items-center shadow-xl shadow-gray-200 active:scale-95 transition-all">
//                   Continue <ChevronRight size={18} className="ml-2" />
//                 </button>
//               ) : (
//                 <button type="submit" disabled={loading} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 flex items-center shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95 transition-all">
//                   {loading ? 'Submitting...' : 'Complete Profile'} <CheckCircle2 size={18} className="ml-2" />
//                 </button>
//               )}
//             </div>
//           </footer>
//         </form>
//       </div>
//     </div>
//   );
// }






'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { db } from '../../../../config/firebase-client';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { 
  User, Code, Briefcase, Link as LinkIcon, MapPin, 
  CheckCircle2, ChevronRight, ChevronLeft, X, Plus, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const TECH_STACK_OPTIONS = [
  "React", "Next.js", "Vue.js", "Angular", "Svelte", "Tailwind CSS", "TypeScript", "JavaScript",
  "Node.js", "Python", "Django", "Flask", "Go", "Rust", "Java", "Spring Boot", "Ruby on Rails",
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase", "Supabase", "Prisma",
  "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform",
  "React Native", "Flutter", "Swift", "Kotlin", "Unity",
  "Figma", "Adobe XD", "Sketch", "GraphQL", "REST API", "WebSockets",
  "OpenAI", "PyTorch", "TensorFlow", "Pandas", "Scikit-learn"
];

const TECH_ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile Developer", 
  "iOS Developer", "Android Developer", "DevOps Engineer", "Cloud Architect", 
  "Data Scientist", "Data Engineer", "AI/ML Engineer", "Security Engineer",
  "UI Designer", "UX Designer", "Product Designer", "UX Researcher",
  "Product Manager", "Technical Product Manager", "Project Manager", "Scrum Master",
  "QA Engineer", "Automation Engineer", "Embedded Systems Engineer", "Blockchain Developer",
  "Site Reliability Engineer (SRE)", "Game Developer", "AR/VR Developer"
];

export default function CandidateOnboarding() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const titleDropdownRef = useRef(null);
  const skillDropdownRef = useRef(null);
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

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
    { id: Date.now(), name: '', description: '', techStack: [], link: '' }
  ]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (titleDropdownRef.current && !titleDropdownRef.current.contains(event.target)) setShowTitleDropdown(false);
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target)) setShowSkillDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- Skill Logic ---
  const addSkill = (skill) => {
    const val = skill.trim();
    if (val && !skills.includes(val)) {
      setSkills([...skills, val]);
    }
    setSkillInput('');
    setShowSkillDropdown(false);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkill(skillInput.trim());
      }
    }
  };

  const removeSkill = (skillToRemove) => setSkills(skills.filter(s => s !== skillToRemove));

  // --- Project Stack Logic ---
  const addProjectStack = (projectId, value) => {
    const val = value.trim();
    if (val) {
      setProjects(projects.map(p => {
        if (p.id === projectId) {
          const exists = p.techStack.includes(val);
          return exists ? p : { ...p, techStack: [...p.techStack, val] };
        }
        return p;
      }));
    }
  };

  const nextStep = (e) => {
    if (e) e.preventDefault();
    if (step === 1 && (!formData.fullName.trim() || !formData.title.trim() || !formData.city.trim())) return toast.error("Please fill in all identity fields");
    if (step === 2 && (skills.length === 0 || !formData.bio.trim())) return toast.error("Please add skills and a bio");
    setStep((s) => s + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = (e) => {
    if (e) e.preventDefault();
    setStep((s) => s - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Trim all final values before saving
      const finalFormData = {
        ...formData,
        fullName: formData.fullName.trim(),
        title: formData.title.trim(),
        city: formData.city.trim(),
        bio: formData.bio.trim()
      };

      const candidateProfile = { 
        ...finalFormData, 
        skills, 
        projects, 
        userId: currentUser.uid, 
        email: currentUser.email, 
        updatedAt: new Date().toISOString() 
      };

      await setDoc(doc(db, "candidates", currentUser.uid), candidateProfile);
      await updateDoc(doc(db, "users", currentUser.uid), { onboardingCompleted: true, fullName: finalFormData.fullName });
      
      await fetch('/api/index-candidate', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(candidateProfile) 
      });

      toast.success("Profile indexed by AI!");
      router.push('/candidate/dashboard');
    } catch (error) { 
      toast.error("Error during setup"); 
    } finally { 
      setLoading(false); 
    }
  };

  const addProject = () => {
    setProjects([...projects, { id: Date.now(), name: '', description: '', techStack: [], link: '' }]);
  };

  const removeProject = (id) => {
    if (projects.length > 1) {
      setProjects(projects.filter(p => p.id !== id));
    } else {
      toast.error("At least one project is required.");
    }
  };

  const updateProject = (id, field, value) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-80 bg-gray-50 border-b md:border-r border-gray-200 p-6 md:p-8 md:h-screen md:sticky md:top-0">
        <nav className="flex md:flex-col justify-between md:space-y-8">
          {[
            { id: 1, name: 'Identity', icon: User },
            { id: 2, name: 'Expertise', icon: Code },
            { id: 3, name: 'Proof', icon: Briefcase }
          ].map((s) => (
            <div key={s.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all ${step >= s.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-400'}`}>
                {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
              </div>
              <div className="hidden md:block">
                <p className={`text-[10px] font-bold tracking-widest uppercase ${step >= s.id ? 'text-blue-600' : 'text-gray-400'}`}>Step 0{s.id}</p>
                <p className={`font-bold text-sm ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>{s.name}</p>
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Form */}
      <div className="flex-1 flex justify-center p-6 md:p-16 bg-white overflow-y-auto">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl py-8 space-y-12">
          
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">Personal Details</h2>
                <p className="text-gray-500 mt-2 text-lg">Define your professional identity.</p>
              </header>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Jane Cooper" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-medium text-gray-900" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                      <input name="city" value={formData.city} onChange={handleChange} placeholder="Lagos, Nigeria" className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-medium text-gray-900" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 relative" ref={titleDropdownRef}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Professional Title</label>
                  <div className="relative">
                    <input value={formData.title} onFocus={() => setShowTitleDropdown(true)} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior Backend Engineer" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-bold text-gray-900" />
                    <ChevronDown className="absolute right-4 top-4 text-gray-400" size={20} />
                  </div>
                  {showTitleDropdown && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2">
                      {TECH_ROLES.filter(r => r.toLowerCase().includes(formData.title.toLowerCase().trim())).length > 0 ? (
                        TECH_ROLES.filter(r => r.toLowerCase().includes(formData.title.toLowerCase().trim())).map(role => (
                          <button key={role} type="button" onClick={() => { setFormData({...formData, title: role}); setShowTitleDropdown(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 font-bold transition-all">{role}</button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-400 text-sm italic">Press outside to use custom title</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">Your Expertise</h2>
                <p className="text-gray-500 mt-2 text-lg">What powers your workflow?</p>
              </header>
              <div className="space-y-6">
                <div className="space-y-2 relative" ref={skillDropdownRef}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Skills & Tools</label>
                  <div className="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 min-h-[70px] flex flex-wrap gap-2 items-center focus-within:bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/5 transition-all">
                    {skills.map(s => (
                      <span key={s} className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-blue-600 flex items-center shadow-sm uppercase tracking-wider">
                        {s} <X size={14} className="ml-2 cursor-pointer hover:text-red-500" onClick={() => removeSkill(s)} />
                      </span>
                    ))}
                    <input 
                      value={skillInput} 
                      onFocus={() => setShowSkillDropdown(true)} 
                      onChange={(e) => setSkillInput(e.target.value)} 
                      onKeyDown={handleSkillKeyDown} 
                      placeholder="Add skill..." 
                      className="bg-transparent border-none focus:ring-0 outline-none flex-1 min-w-[120px] text-sm py-2 px-2 font-medium" 
                    />
                  </div>
                  {showSkillDropdown && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2">
                      {TECH_STACK_OPTIONS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase().trim()) && !skills.includes(s)).map(skill => (
                        <button key={skill} type="button" onClick={() => addSkill(skill)} className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 font-bold transition-all flex justify-between">{skill} <Plus size={16} /></button>
                      ))}
                      {skillInput.trim() && !TECH_STACK_OPTIONS.some(s => s.toLowerCase() === skillInput.toLowerCase().trim()) && (
                        <button type="button" onClick={() => addSkill(skillInput)} className="w-full text-left px-4 py-3 hover:bg-blue-50 text-blue-600 rounded-xl font-bold transition-all flex justify-between">Add "{skillInput.trim()}" <Plus size={16} /></button>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bio</label>
                  <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} placeholder="Describe your tech journey..." className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-medium text-gray-900 resize-none" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <header>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">Featured Projects</h2>
                <p className="text-gray-500 mt-2 text-lg">Prove your expertise through action.</p>
              </header>

              <div className="space-y-8">
                {projects.map((proj) => (
                  <div key={proj.id} className="relative p-8 rounded-[2.5rem] border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-100 transition-all group">
                    <button type="button" onClick={() => removeProject(proj.id)} className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors">
                      <X size={18} />
                    </button>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Project Name</label>
                        <input placeholder="e.g. AI-Powered CRM" className="w-full bg-gray-50 px-5 py-4 rounded-2xl text-xl font-bold text-gray-800 outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white border border-gray-100 focus:border-blue-600 transition-all"
                          value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea placeholder="The problem you solved..." className="w-full bg-gray-50 px-5 py-4 rounded-2xl text-base text-gray-600 outline-none resize-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white border border-gray-100 focus:border-blue-600 transition-all" rows="3"
                          value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Project Stack</label>
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100 min-h-[58px]">
                          {proj.techStack.map(t => (
                            <span key={t} className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-bold text-blue-600 uppercase flex items-center shadow-sm">
                              {t} <X size={10} className="ml-1.5 cursor-pointer" onClick={() => {
                                setProjects(projects.map(p => p.id === proj.id ? { ...p, techStack: p.techStack.filter(st => st !== t) } : p));
                              }} />
                            </span>
                          ))}
                          <input 
                            placeholder="+ Add Tech" 
                            className="text-xs font-bold text-gray-700 outline-none bg-transparent px-2 w-28"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addProjectStack(proj.id, e.target.value);
                                e.target.value = '';
                              }
                            }} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Live Link / Repository (Optional)</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-4 top-4 text-gray-400" size={18} />
                          <input 
                            placeholder="https://github.com/yourproject" 
                            className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-medium text-gray-900"
                            value={proj.link} 
                            onChange={(e) => updateProject(proj.id, 'link', e.target.value)} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addProject} className="w-full py-8 rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-500 hover:text-blue-600 hover:bg-blue-50/30 hover:border-blue-200 transition-all font-bold flex flex-col items-center justify-center space-y-2 group">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-blue-200"><Plus size={24} /></div>
                  <span className="text-lg">Add Another Project</span>
                </button>
              </div>
            </div>
          )}

          <footer className="flex items-center justify-between pt-8 border-t border-gray-100 sticky bottom-0 bg-white pb-4 z-20">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="flex items-center text-gray-400 font-bold hover:text-gray-900 transition-colors">
                <ChevronLeft size={20} className="mr-1" /> Back
              </button>
            ) : <div />}
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-gray-300">Page {step} of 3</span>
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 flex items-center shadow-xl shadow-gray-200 active:scale-95 transition-all">
                  Continue <ChevronRight size={18} className="ml-2" />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 flex items-center shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95 transition-all">
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