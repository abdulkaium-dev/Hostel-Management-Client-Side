import axiosInstance from "../Api/axios";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          const res = await axiosInstance.get(`/users/${user.email}`);
          setRole(res.data.role || "user");  // Make sure your DB has role field
        } catch (err) {
          console.error("Failed to fetch role:", err);
          setRole("user");
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return [role, loading];
};

export default useRole;
