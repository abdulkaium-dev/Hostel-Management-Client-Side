import React from "react";
import { Navigate } from "react-router-dom";
import useRole from "../hooks/Admin";



const AdminRoute = ({ children }) => {
  const [role, loading] = useRole();

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  if (role === "admin") {
    return children;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default AdminRoute;
