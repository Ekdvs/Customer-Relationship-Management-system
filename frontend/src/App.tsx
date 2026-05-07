
import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import CreateLead from "./pages/CreateLead";
import EditLead from "./pages/EditLead";
import LeadDetails from "./pages/LeadDetails";
import AllActivities from './pages/AllActivities';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import MyLeads from './pages/Myleads';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Protects routes that require Admin role
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return !token ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
      <Route path="/leads/:id" element={<PrivateRoute><LeadDetails /></PrivateRoute>} />
      <Route path="/create-lead" element={<AdminRoute><CreateLead /></AdminRoute>} />
      <Route path="/leads/edit/:id" element={<PrivateRoute><EditLead /></PrivateRoute>} />
      <Route path="/activities" element={<AdminRoute><AllActivities /></AdminRoute>} />
      <Route path="/my-leads" element={<PrivateRoute><MyLeads /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;