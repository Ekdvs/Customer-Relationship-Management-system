import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { Lead } from "../utils/type";
import Badge from "../components/Badge";
import {
  MdPeople,
  MdEmojiEvents,
  MdCancel,
  MdTrendingUp,
  MdAttachMoney,
  MdNoteAdd,
  MdArrowForward,
} from "react-icons/md";
import { FiRefreshCw, FiEye } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SalesDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMyLeads = async () => {
    try {
      setLoading(true);
      // Sales user fetches their assigned leads
      const res = await api.get("/leads/my-leads");
      setLeads(res.data.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load your leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeads();
  }, []);

  // Derived stats from my leads only
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === "Won");
  const lostLeads = leads.filter((l) => l.status === "Lost");
  const newLeads = leads.filter((l) => l.status === "New");
  const qualifiedLeads = leads.filter((l) => l.status === "Qualified");
  const myRevenue = wonLeads.reduce((s, l) => s + (l.dealValue || 0), 0);
  const myPipeline = leads
    .filter((l) => !["Won", "Lost"].includes(l.status))
    .reduce((s, l) => s + (l.dealValue || 0), 0);
  const conversionRate =
    totalLeads === 0 ? 0 : ((wonLeads.length / totalLeads) * 100).toFixed(1);

  const recentLeads = [...leads]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  const chartData = [
    { name: "New", value: newLeads.length, color: "#6366f1" },
    { name: "Qualified", value: qualifiedLeads.length, color: "#8b5cf6" },
    { name: "Won", value: wonLeads.length, color: "#10b981" },
    { name: "Lost", value: lostLeads.length, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const statCards = [
    {
      label: "My Leads",
      value: totalLeads,
      icon: <MdPeople size={22} />,
      bg: "bg-indigo-500",
      light: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Won Deals",
      value: wonLeads.length,
      icon: <MdEmojiEvents size={22} />,
      bg: "bg-emerald-500",
      light: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Lost Deals",
      value: lostLeads.length,
      icon: <MdCancel size={22} />,
      bg: "bg-rose-500",
      light: "bg-rose-50 text-rose-600",
    },
    {
      label: "Conversion",
      value: `${conversionRate}%`,
      icon: <MdTrendingUp size={22} />,
      bg: "bg-amber-500",
      light: "bg-amber-50 text-amber-600",
    },
    {
      label: "My Revenue",
      value: `$${myRevenue.toLocaleString()}`,
      icon: <MdAttachMoney size={22} />,
      bg: "bg-green-500",
      light: "bg-green-50 text-green-600",
    },
    {
      label: "My Pipeline",
      value: `$${myPipeline.toLocaleString()}`,
      icon: <MdNoteAdd size={22} />,
      bg: "bg-sky-500",
      light: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Your personal sales pipeline
          </p>
        </div>
        <button
          onClick={fetchMyLeads}
          className="text-sm bg-white border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${card.bg}`}
                >
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    {card.label}
                  </p>
                  <p className="text-xl font-bold text-gray-800">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-4">
                  My Lead Distribution
                </h2>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {chartData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Leads */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">Recent Leads</h2>
                <button
                  onClick={() => navigate("/my-leads")}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                >
                  View All <MdArrowForward size={14} />
                </button>
              </div>
              {recentLeads.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">
                  No leads assigned yet
                </div>
              ) : (
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <div
                      key={lead._id}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {lead.leadName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {lead.companyName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge label={lead.status} />
                        <button
                          onClick={() => navigate(`/leads/${lead._id}`)}
                          className="p-1 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <FiEye size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default SalesDashboard;