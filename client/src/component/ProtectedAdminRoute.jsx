import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../../api/axios.js";

const ProtectedAdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // call backend verify route
        const res = await axiosInstance.get("/auth/verify");
        if (res.data.valid) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (error) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) return <p className="text-center mt-10">Checking admin access...</p>;

  if (!authorized) return <Navigate to="/admin/login" replace />;

  return children;
};

export default ProtectedAdminRoute;
