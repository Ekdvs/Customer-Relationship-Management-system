import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  MdDashboard,
  MdPeople,
  MdPersonAdd,
  MdHistory,
  MdAssignment,
} from "react-icons/md";

const Sidebar = () => {
  const { isAdmin } = useContext(AuthContext);

  // Admin nav items — full system access
  const adminNavItems = [
    { to: "/", label: "Dashboard", icon: <MdDashboard size={18} /> },
    { to: "/leads", label: "All Leads", icon: <MdPeople size={18} /> },
    { to: "/create-lead", label: "Create Lead", icon: <MdPersonAdd size={18} /> },
    { to: "/activities", label: "All Activities", icon: <MdHistory size={18} /> },
  ];

  // Sales nav items — restricted to own data
  const salesNavItems = [
    { to: "/", label: "My Dashboard", icon: <MdDashboard size={18} /> },
    { to: "/my-leads", label: "My Leads", icon: <MdAssignment size={18} /> },
  ];

  const navItems = isAdmin ? adminNavItems : salesNavItems;

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen flex-shrink-0 flex flex-col">
      <nav className="p-4 flex flex-col gap-1 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-gray-100">
        <span
          className={`block text-center text-xs font-semibold rounded-full px-2 py-1 mb-2 ${
            isAdmin
              ? "bg-indigo-50 text-indigo-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {isAdmin ? "Admin" : "Sales"}
        </span>
        <p className="text-xs text-gray-400 text-center">v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;