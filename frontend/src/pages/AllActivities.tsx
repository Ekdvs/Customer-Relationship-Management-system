import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import type { Activity } from "../utils/type";
import { FiRefreshCw } from "react-icons/fi";
import {
  MdHistory,
  MdAutoAwesome,
  MdEdit,
  MdSwapHoriz,
  MdNote,
  MdDelete,
} from "react-icons/md";

// Maps activity.type → icon component
const activityIconMap: Record<string, React.ReactNode> = {
  lead_created: <MdAutoAwesome />,
  lead_updated: <MdEdit />,
  status_changed: <MdSwapHoriz />,
  note_added: <MdNote />,
  lead_deleted: <MdDelete />,
};

// Maps activity.type → card background + border color
const activityColorMap: Record<string, string> = {
  lead_created: "bg-green-50 border-green-100",
  lead_updated: "bg-blue-50 border-blue-100",
  status_changed: "bg-purple-50 border-purple-100",
  note_added: "bg-amber-50 border-amber-100",
  lead_deleted: "bg-red-50 border-red-100",
};

// Maps activity.type → icon bubble color
const iconBubbleColorMap: Record<string, string> = {
  lead_created: "bg-green-100 text-green-600",
  lead_updated: "bg-blue-100 text-blue-600",
  status_changed: "bg-purple-100 text-purple-600",
  note_added: "bg-amber-100 text-amber-600",
  lead_deleted: "bg-red-100 text-red-600",
};

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "lead_created", label: "Created" },
  { value: "lead_updated", label: "Updated" },
  { value: "status_changed", label: "Status" },
  { value: "note_added", label: "Note" },
  { value: "lead_deleted", label: "Deleted" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const AllActivities = () => {
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Admin access required");
      navigate("/");
      return;
    }
    fetchActivities();
  }, [isAdmin]);

  // ─── GET /api/activities/ ─────────────────────────────────────────────────
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/activities"); // getAllActivities
      setActivities(res.data.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const filtered = typeFilter
    ? activities.filter((a) => a.type === typeFilter)
    : activities;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Activities</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            System-wide audit log · {filtered.length} entries
          </p>
        </div>
        <button
          onClick={fetchActivities}
          className="text-sm bg-white border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-500 font-medium mr-1">Filter:</span>
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTypeFilter(opt.value)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              typeFilter === opt.value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {opt.value && (
              <span className="mr-1">
                {activityIconMap[opt.value]}
              </span>
            )}
            {opt.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center text-gray-400">
          <MdHistory size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No activities found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 space-y-4 relative">
            {/* Timeline vertical line */}
            <div className="absolute left-[43px] top-6 bottom-6 w-0.5 bg-gray-100" />

            {filtered.map((act) => (
              <div key={act._id} className="flex gap-4 items-start relative">
                {/* Icon bubble */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0 z-10 shadow-sm ${
                    iconBubbleColorMap[act.type] || "bg-gray-100 text-gray-500"
                  }`}
                >
                  {activityIconMap[act.type] || <MdHistory />}
                </div>

                {/* Card */}
                <div
                  className={`flex-1 rounded-xl px-4 py-3 border ${
                    activityColorMap[act.type] || "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-800 font-medium">
                      {act.message}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                      {formatDate(act.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    by{" "}
                    <span className="font-semibold text-gray-700">
                      {act.createdBy?.name || "System"}
                    </span>
                    {act.createdBy?.email && (
                      <span className="text-gray-400">
                        {" "}
                        · {act.createdBy.email}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllActivities;