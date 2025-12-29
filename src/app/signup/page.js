// 'use client';
// import { useState } from 'react';
// import { useAuth } from '@/context/AuthProvider';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { Briefcase, User, ArrowRight, Chrome } from 'lucide-react'; 

// export default function Signup() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('candidate');
//   const [loading, setLoading] = useState(false);
//   const { signup } = useAuth(); // Note: If you add Google login to AuthProvider, destructure it here

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await signup(email, password, role);
//       toast.success("Welcome to the pride! 🐼");
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
//       {/* Left Side: Branding/Value Prop (Hidden on Mobile) */}
//       <div className="hidden md:flex md:w-1/2 bg-blue-600 p-16 flex-col justify-between text-white relative overflow-hidden">
//         {/* Abstract Background Decoration */}
//         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
//         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>

//         <div className="relative z-10">
//           <h1 className="text-2xl font-bold tracking-tight">Panda Talent</h1>
//         </div>

//         <div className="relative z-10">
//           <h2 className="text-6xl font-extrabold leading-[1.1] mb-8">
//             The future of <br /> 
//             <span className="text-blue-300">tech hiring</span> <br />
//             is semantic.
//           </h2>
//           <p className="text-xl text-blue-100 max-w-md leading-relaxed">
//             Stop keywords matching. Start meaningful connections. Our AI understands your skills better than any recruiter.
//           </p>
//         </div>

//         <div className="relative z-10 flex items-center space-x-4 text-sm text-blue-200">
//           <div className="flex -space-x-2">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-600 bg-blue-400 flex items-center justify-center text-[10px] font-bold">U{i}</div>
//             ))}
//           </div>
//           <span>Joined by 2,000+ tech pros this month</span>
//         </div>
//       </div>

//       {/* Right Side: Signup Form */}
//       <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50 md:bg-white">
//         <div className="max-w-md w-full">
          
//           {/* Mobile Only Header */}
//           <div className="md:hidden mb-10 text-center">
//             <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200">
//               <span className="text-xl font-bold">P</span>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Panda Talent</h1>
//           </div>

//           <div className="mb-8 text-center md:text-left">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
//             <p className="text-gray-500">Free to join. Unlimited AI matching.</p>
//           </div>

//           {/* Social Signup Pro-Tip */}
//           <div className="space-y-3 mb-8">
//             <button 
//               type="button"
//               className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700 space-x-3"
//             >
//               <Chrome size={20} className="text-blue-500" />
//               <span>Continue with Google</span>
//             </button>
//             <div className="relative flex items-center py-2">
//               <div className="flex-grow border-t border-gray-200"></div>
//               <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-widest">or email</span>
//               <div className="flex-grow border-t border-gray-200"></div>
//             </div>
//           </div>

//           <form onSubmit={handleSignup} className="space-y-5">
//             {/* Role Selection */}
//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 type="button"
//                 onClick={() => setRole('candidate')}
//                 className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
//                   role === 'candidate' 
//                   ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50' 
//                   : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
//                 }`}
//               >
//                 <div className={`p-2 rounded-lg mb-3 ${role === 'candidate' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
//                   <User size={18} />
//                 </div>
//                 <span className={`text-sm font-bold ${role === 'candidate' ? 'text-blue-900' : 'text-gray-500'}`}>Candidate</span>
//                 <span className="text-[10px] text-gray-400 mt-1">I want to be hired</span>
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setRole('employer')}
//                 className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
//                   role === 'employer' 
//                   ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50' 
//                   : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
//                 }`}
//               >
//                 <div className={`p-2 rounded-lg mb-3 ${role === 'employer' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
//                   <Briefcase size={18} />
//                 </div>
//                 <span className={`text-sm font-bold ${role === 'employer' ? 'text-blue-900' : 'text-gray-500'}`}>Employer</span>
//                 <span className="text-[10px] text-gray-400 mt-1">I am hiring talent</span>
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div className="group">
//                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Email</label>
//                 <input 
//                   type="email" required
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
//                   onChange={(e) => setEmail(e.target.value)} 
//                 />
//               </div>
//               <div className="group">
//                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Password</label>
//                 <input 
//                   type="password" required
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
//                   onChange={(e) => setPassword(e.target.value)} 
//                 />
//               </div>
//             </div>

//             <button 
//               disabled={loading}
//               className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-blue-100 active:scale-[0.98] disabled:opacity-70"
//             >
//               <span>{loading ? "Processing..." : "Create Account"}</span>
//               {!loading && <ArrowRight size={18} />}
//             </button>

//             <p className="text-center text-sm text-gray-500 mt-6">
//               Already a member?{' '}
//               <Link href="/login" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
//                 Sign in here
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }







'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Briefcase, User, ArrowRight, Chrome } from 'lucide-react'; 

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate'); // Default role
  const [loading, setLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, role);
      toast.success("Welcome to the pride! 🐼");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      // FIX: Explicitly pass 'true' to signal this is a signup attempt
      await signInWithGoogle(role, true);
      toast.success("Welcome to the pride! 🐼");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {/* Left Side: Branding */}
        <div className="hidden md:flex md:w-1/2 bg-blue-600 p-16 flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-6xl font-extrabold leading-[1.1] mb-8">
              The future of <br /> <span className="text-blue-300">tech hiring</span> <br /> is semantic.
            </h2>
            <p className="text-xl text-blue-100 max-w-md leading-relaxed">
              Stop keywords matching. Start meaningful connections.
            </p>
          </div>
        </div>

      {/* Right Side: Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50 md:bg-white">
        <div className="max-w-md w-full">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-500 font-medium">Step 1: Choose your path</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                role === 'candidate' 
                ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50' 
                : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
              }`}
            >
              <div className={`p-2 rounded-lg mb-3 ${role === 'candidate' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <User size={18} />
              </div>
              <span className={`text-sm font-bold ${role === 'candidate' ? 'text-blue-900' : 'text-gray-500'}`}>Candidate</span>
              <span className="text-[10px] text-gray-400 mt-1 text-left">I am looking for a job</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                role === 'employer' 
                ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50' 
                : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
              }`}
            >
              <div className={`p-2 rounded-lg mb-3 ${role === 'employer' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Briefcase size={18} />
              </div>
              <span className={`text-sm font-bold ${role === 'employer' ? 'text-blue-900' : 'text-gray-500'}`}>Employer</span>
              <span className="text-[10px] text-gray-400 mt-1 text-left">I am hiring talent</span>
            </button>
          </div>

          {/* Google SSO */}
          <div className="space-y-3 mb-8">
            <button 
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center py-3.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-gray-700 space-x-3 disabled:opacity-50"
            >
              <Chrome size={20} className="text-blue-500" />
              <span>{loading ? "Connecting..." : "Continue with Google"}</span>
            </button>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-widest font-bold">or use email</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Email</label>
                <input 
                  type="email" required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-gray-50 focus:bg-white"
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Password</label>
                <input 
                  type="password" required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-gray-50 focus:bg-white"
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-blue-100 disabled:opacity-70"
            >
              <span>{loading ? "Processing..." : "Create Account"}</span>
              {!loading && <ArrowRight size={18} />}
            </button>

            <p className="text-center text-sm text-gray-500 mt-6 font-medium">
              Already a member?{' '}
              <Link href="/login" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}