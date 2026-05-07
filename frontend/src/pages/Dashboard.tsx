import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "./Admindashboard";
import SalesDashboard from "./Salesdashboard";


// Routes to the correct dashboard based on the user's role
const Dashboard = () => {
  const { isAdmin } = useContext(AuthContext);
  return isAdmin ? <AdminDashboard /> : <SalesDashboard />;
};

export default Dashboard;