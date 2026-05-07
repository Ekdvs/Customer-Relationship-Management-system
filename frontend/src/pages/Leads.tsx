import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Badge from "../components/Badge";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Lead } from "../utils/type";
import { FiSearch, FiPlus, FiEye, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (priorityFilter) params.append("priority", priorityFilter);
      const res = await api.get(`/leads/get?${params.toString()}`);
      setLeads(res.data.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter]);

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await api.delete(`/leads/delete/${id}`);
      toast.success("Lead deleted");
      fetchLeads();
    } catch {
      toast.error("Delete failed");
    }
  };

  const inputClass = "border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">{leads.length} total leads</p>
        </div>
        <button onClick={() => navigate("/create-lead")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
          <FiPlus size={15} /> Create Lead
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input type="text" className={`${inputClass} w-full pl-9`} placeholder="Search by name, email, company..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal">Proposal</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
        <select className={inputClass} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {(search || statusFilter || priorityFilter) && (
          <button onClick={() => { setSearch(""); setStatusFilter(""); setPriorityFilter(""); }} className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1 transition">
            <FiX size={14} /> Clear
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : leads.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <FiSearch size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No leads found</p>
            <p className="text-sm mt-1">Try adjusting your filters or create a new lead</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Lead</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Deal Value</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned To</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{lead.leadName}</p>
                      <p className="text-xs text-gray-400">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.companyName}</td>
                    <td className="px-4 py-3"><Badge label={lead.status} /></td>
                    <td className="px-4 py-3"><Badge label={lead.priority || "Low"} /></td>
                    <td className="px-4 py-3"><span className="text-indigo-600 font-semibold">{lead.score ?? 0}</span></td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{lead.dealValue ? `$${lead.dealValue.toLocaleString()}` : "—"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{(lead.assignedTo as any)?.name || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/leads/${lead._id}`)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="View">
                          <FiEye size={14} />
                        </button>
                        <button onClick={() => navigate(`/leads/edit/${lead._id}`)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Edit">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => deleteLead(lead._id!)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Leads;