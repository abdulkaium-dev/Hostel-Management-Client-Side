import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../Component/firebase.init';
import { AuthContext } from './AuthContext';
import Cookies from 'js-cookie';
import { getIdToken } from 'firebase/auth';

const AuthProvider = ({ children }) => {
  const googleProvider = new GoogleAuthProvider();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Utility: Save token to cookie
  const saveTokenToCookie = async (firebaseUser) => {
    if (firebaseUser) {
      const token = await getIdToken(firebaseUser);
      Cookies.set("auth_token", token, { expires: 7 }); // 7 days valid
    }
  };

  // ✅ Create user with email/password
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ✅ Google Sign In
  const createUserWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // ✅ Login existing user
  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ✅ Logout user & remove cookie
  const logOutUser = async () => {
    await signOut(auth);
    Cookies.remove("auth_token");
    setUser(null);
  };

  // ✅ Update profile
  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

  // ✅ Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // ✅ Keep user state & save token in cookie
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        await saveTokenToCookie(currentUser); // ✅ Login হলে token cookie তে add
      } else {
        Cookies.remove("auth_token"); // ✅ User null হলে cookie remove
      }
    });

    return () => unSubscribe();
  }, []);

  const authData = {
    user,
    setUser,
    createUser,
    loading,
    loginUser,
    logOutUser,
    createUserWithGoogle,
    updateUser,
    resetPassword
  };

  return <AuthContext value={authData}>{children}</AuthContext>;
};

export default AuthProvider;
