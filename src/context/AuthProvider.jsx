// 'use client';
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { auth, db } from '../../config/firebase-client';
// import { 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   onAuthStateChanged, 
//   signOut 
// } from 'firebase/auth';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import { useRouter, usePathname } from 'next/navigation';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();

//   // 1. SIGN UP Logic
//   const signup = async (email, password, role) => {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Initial profile document
//     await setDoc(doc(db, "users", user.uid), {
//       uid: user.uid,
//       email: email,
//       role: role, 
//       onboardingCompleted: false, // New flag to track progress
//       createdAt: new Date().toISOString()
//     });

//     return userCredential;
//   };

//   // 2. LOGIN Logic
//   const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

//   // 3. LOGOUT Logic
//   const logout = async () => {
//     await signOut(auth);
//     router.push('/login');
//   };

//   // 4. Listen for Auth Changes & Handle Logic
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       try {
//         if (user) {
//           const userDoc = await getDoc(doc(db, "users", user.uid));
          
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setCurrentUser({ ...user, ...userData });

//             // Define the destination based on onboarding status
//             const isCandidate = userData.role === 'candidate';
//             const isEmployer = userData.role === 'employer';
            
//             // Redirect logic
//             if (!userData.onboardingCompleted) {
//               // If onboarding isn't done, force them to the onboarding page
//               const onboardingPath = isCandidate ? '/candidate/onboarding' : '/employer/onboarding';
//               if (pathname !== onboardingPath) {
//                 router.push(onboardingPath);
//               }
//             } else {
//               // If onboarding IS done, send them to dashboard (if they aren't already there)
//               const dashboardPath = isCandidate ? '/candidate/dashboard' : '/employer/dashboard';
//               if (pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname.includes('onboarding')) {
//                 router.push(dashboardPath);
//               }
//             }
//           }
//         } else {
//           setCurrentUser(null);
//           // If not logged in and trying to access protected routes, redirect to login
//           if (pathname.includes('/candidate') || pathname.includes('/employer')) {
//             router.push('/login');
//           }
//         }
//       } catch (error) {
//         console.error("Auth State Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     });

//     return unsubscribe;
//   }, [router, pathname]);

//   return (
//     <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../../config/firebase-client';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 1. SIGN UP Logic (Email/Password)
  const signup = async (email, password, role) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      role: role, 
      onboardingCompleted: false,
      createdAt: new Date().toISOString()
    });

    return userCredential;
  };

  // 2. GOOGLE SSO Logic
  const signInWithGoogle = async (role = 'candidate', isSignup = false) => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const { isNewUser } = getAdditionalUserInfo(result);
    const user = result.user;

    // PROTECTION: If user is new but is on the LOGIN page
    if (isNewUser && !isSignup) {
      await deleteUser(user); // Clean up the auth record
      throw new Error("No account found. Please sign up first!");
    }

    // SUCCESSFUL SIGNUP: If user is new and is on the SIGNUP page
    if (isNewUser && isSignup) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: role,
        onboardingCompleted: false,
        createdAt: new Date().toISOString()
      });
    }

    return result;
  };

  // 3. LOGIN Logic
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // 4. LOGOUT Logic
  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // 5. Auth State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({ ...user, ...userData });

            const isCandidate = userData.role === 'candidate';
            const onboardingPath = isCandidate ? '/candidate/onboarding' : '/employer/onboarding';
            const dashboardPath = isCandidate ? '/candidate/dashboard' : '/employer/dashboard';
            
            if (!userData.onboardingCompleted) {
              if (pathname !== onboardingPath) {
                router.push(onboardingPath);
              }
            } else {
              if (pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname.includes('onboarding')) {
                router.push(dashboardPath);
              }
            }
          }
        } else {
          setCurrentUser(null);
          if (pathname.includes('/candidate') || pathname.includes('/employer')) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error("Auth State Error:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout, signInWithGoogle }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};