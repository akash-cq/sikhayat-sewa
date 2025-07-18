import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,

} from "react-router-dom";

import Login from "../components/auth/login/Login";
import UsersAdd from "../userMng";
import Requests from "../components/Requests/Request";
import DocumentsPage from "../components/Requests/Document";

import { useAuthStore } from "../store/store";
import PersonDoc from "../components/Requests/PersonDoc";
import ReportPage from "../components/Report";
import ProtectedRoute from "./ProtectedRoutes";
import RoleProtectedRoute from "./Rollprotected";
import Dashboard from "./dashboard";
import RedirectByRole from "./RedirectRole";
import Profile from "../components/Profile/profile";

// Hardcoded roles
const roles = {
  user: 0,
  admin: 1,
};

// Placeholder 404 Page
const NotFound = () => (
  <div className="text-center mt-10 text-xl text-red-500">
    404 - Page Not Found
  </div>
);

export default function AppRouter() {
  const session = useAuthStore().session;
 return (
   <Routes>
     <Route
       path="/login"
       element={
         session.isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
       }
     />
     <Route path="/" element={<Dashboard />}>
       <Route path="" element={<Navigate to="/dashboard/" />} />
       <Route path="/dashboard" element={<ProtectedRoute />}>
         <Route path="" />
         <Route index element={<RedirectByRole />} />
         <Route
           element={
             <RoleProtectedRoute allowedRoles={[roles.user, roles.admin]} />
           }
         >
           <Route path="requests" element={<Requests />} />
           <Route
             path="requests/:RequestId/document"
             element={<DocumentsPage />}
           />
           <Route
             path="requests/:RequestId/document/:ComplaintId"
             element={<PersonDoc />}
           />
           <Route path="requests/:RequestId" element={<ReportPage />} />
           <Route path="users" element={<UsersAdd />} />
           <Route path="profile" element={<Profile />} />
         </Route>
         <Route path="*" element={<NotFound />} />
       </Route>
     </Route>
   </Routes>
 );
}