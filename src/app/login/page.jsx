// 'use client';
// import { useState } from 'react';
// import { useAuth } from '@/context/AuthProvider';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await login(email, password);
//       toast.success("Welcome back!");
//       // Note: AuthProvider's useEffect handles the redirect based on role
//     } catch (error) {
//       console.error(error);
//       toast.error("Invalid credentials. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
//       {/* Background Decor */}
//       <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
//         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
//         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50"></div>
//       </div>

//       <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 md:p-12 relative z-10 border border-white">
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl text-white mb-6 shadow-lg shadow-blue-200">
//             <span className="text-2xl font-black">P</span>
//           </div>
//           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Panda Talent</h1>
//           <p className="text-slate-500 mt-2 font-medium">Log in to your command center</p>
//         </div>

//         <form onSubmit={handleLogin} className="space-y-5">
//           <div className="space-y-4">
//             <div className="relative group">
//               <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
//                 <input 
//                   type="email" 
//                   required 
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="name@company.com" 
//                   className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
//                 />
//               </div>
//             </div>

//             <div className="relative group">
//               <div className="flex justify-between items-center mb-2 ml-1">
//                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
//                 <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</Link>
//               </div>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
//                 <input 
//                   type="password" 
//                   required 
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••" 
//                   className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
//                 />
//               </div>
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading}
//             className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-70 mt-4"
//           >
//             {loading ? (
//               <Loader2 className="animate-spin" size={20} />
//             ) : (
//               <>
//                 <span>Sign In</span>
//                 <ArrowRight size={18} />
//               </>
//             )}
//           </button>
//         </form>

//         <div className="mt-10 pt-8 border-t border-slate-100 text-center text-sm font-medium">
//           <span className="text-slate-500">Don't have an account?</span>{' '}
//           <Link href="/signup" className="text-blue-600 font-bold hover:text-blue-800 transition-colors underline-offset-4 hover:underline">
//             Create one for free
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }




'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Lock, Mail, ArrowRight, Loader2, Chrome } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back! 🐼");
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // isSignup = false tells the AuthProvider to reject new users
      await signInWithGoogle(null, false); 
      toast.success("Signed in successfully!");
    } catch (error) {
      if (error.message === "No account found. Please sign up first!") {
        toast.error(error.message);
        // Reroute to signup page after a short delay
        setTimeout(() => router.push('/signup'), 1500);
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 relative z-10 border border-white">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl text-white mb-6 shadow-lg shadow-blue-100">
            <span className="text-2xl font-black">P</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Panda Talent</h1>
          <p className="text-slate-500 mt-2 font-medium">Log in to your command center</p>
        </div>

        {/* Google Login Section */}
        <div className="space-y-3 mb-8">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center py-4 px-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold text-gray-700 space-x-3 disabled:opacity-50"
          >
            <Chrome size={20} className="text-blue-500" />
            <span>{loading ? "Connecting..." : "Continue with Google"}</span>
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="mx-4 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">or email</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address" 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-slate-200 disabled:opacity-70 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center text-sm font-medium">
          <span className="text-slate-500">Don't have an account?</span>{' '}
          <Link href="/signup" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
            Create one for free
          </Link>
        </div>
      </div>
    </div>
  );
}