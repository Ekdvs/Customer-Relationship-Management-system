import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import StatsCard from "../components/StatsCard";
import DashboardChart from "../components/DashboardChart";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import type { DashboardStats } from "../utils/type";
import {
  MdPeople,
  MdAutoAwesome,
  MdCheckCircle,
  MdEmojiEvents,
  MdCancel,
  MdTrendingUp,
  MdAttachMoney,
  MdStar,
  MdBarChart,
  MdGroups,
} from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";
import api2 from "../services/api";

interface SalesPerformance {
  _id: string;
  name: string;
  email: string;
  totalLeads: number;
  wonLeads: number;
  lostLeads: number;
  revenue: number;
  conversionRate: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesPerf, setSalesPerf] = useState<SalesPerformance[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashRes, perfRes] = await Promise.all([
        api.get("/dashboard"),
        api2.get("/dashboard/sales-performance").catch(() => ({ data: { data: [] } })),
      ]);
      setStats(dashRes.data);
      setSalesPerf(perfRes.data.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Company-wide CRM overview
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          className="text-sm bg-white border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <StatsCard
              title="Total Leads"
              value={stats.totalLeads}
              icon={<MdPeople />}
              color="bg-indigo-50 text-indigo-500"
            />
            <StatsCard
              title="New Leads"
              value={stats.newLeads}
              icon={<MdAutoAwesome />}
              color="bg-blue-50 text-blue-500"
            />
            <StatsCard
              title="Qualified"
              value={stats.qualified}
              icon={<MdCheckCircle />}
              color="bg-purple-50 text-purple-500"
            />
            <StatsCard
              title="Won"
              value={stats.won}
              icon={<MdEmojiEvents />}
              color="bg-green-50 text-green-500"
            />
            <StatsCard
              title="Lost"
              value={stats.lost}
              icon={<MdCancel />}
              color="bg-red-50 text-red-500"
            />
            <StatsCard
              title="Conversion Rate"
              value={`${stats.conversionRate}%`}
              icon={<MdTrendingUp />}
              color="bg-amber-50 text-amber-500"
            />
            <StatsCard
              title="Total Deal Value"
              value={`$${Number(stats.totalDealValue).toLocaleString()}`}
              icon={<MdAttachMoney />}
              color="bg-green-50 text-green-600"
            />
            <StatsCard
              title="Won Deal Value"
              value={`$${Number(stats.wonDealValue || 0).toLocaleString()}`}
              icon={<MdStar />}
              color="bg-emerald-50 text-emerald-600"
            />
            <StatsCard
              title="Avg Deal Value"
              value={`$${Number(stats.avgDealValue || 0).toLocaleString()}`}
              icon={<MdBarChart />}
              color="bg-sky-50 text-sky-500"
            />
          </div>

          {/* Chart */}
          <DashboardChart stats={stats} />

          {/* Sales Performance Table */}
          {salesPerf.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <MdGroups size={20} className="text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Salesperson Performance
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Total Leads
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Won
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Lost
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Revenue
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Conversion
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {salesPerf.map((sp) => (
                      <tr
                        key={sp._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800">
                            {sp.name}
                          </p>
                          <p className="text-xs text-gray-400">{sp.email}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {sp.totalLeads}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-emerald-600 font-semibold">
                            {sp.wonLeads}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-red-500 font-semibold">
                            {sp.lostLeads}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 font-medium">
                          ${sp.revenue.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              Number(sp.conversionRate) >= 50
                                ? "bg-green-50 text-green-700"
                                : Number(sp.conversionRate) >= 25
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {sp.conversionRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && !stats && (
        <div className="text-center py-20 text-gray-400">
          <MdPeople size={48} className="mx-auto mb-3 opacity-30" />
          <p>No data available</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;