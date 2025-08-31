import React from "react";
import { Navigate } from "react-router-dom";
import useRole from "../hooks/Admin";


const UserRoute = ({ children }) => {
  const [role, loading] = useRole();

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  if (role === "user") {
    return children;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default UserRoute;
