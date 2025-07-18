// 
import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/store";

interface RoleProtectedRouteProps {
  allowedRoles: number[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const session = useAuthStore().session;
  if (!session) {
    return <div>Loading session ...</div>;
  }

  const hasAccess = allowedRoles.includes(session.roll);
  return hasAccess ? <Outlet /> : <Navigate to="/dashboard/requests" replace />;
};

export default RoleProtectedRoute;
