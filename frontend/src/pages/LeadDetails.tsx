import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import Badge from "../components/Badge";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import type { Note, Activity } from "../utils/type";
import { FiArrowLeft, FiEdit2, FiSend, FiSave } from "react-icons/fi";
import {
  MdPhone,
  MdEmail,
  MdGroups,
  MdNote,
  MdHistory,
  MdAutoAwesome,
  MdEdit,
  MdSwapHoriz,
  MdDelete,
} from "react-icons/md";

const noteIconMap: Record<string, React.ReactNode> = {
  note: <MdNote />,
  call: <MdPhone />,
  email: <MdEmail />,
  meeting: <MdGroups />,
};

const activityIconMap: Record<string, React.ReactNode> = {
  lead_created: <MdAutoAwesome />,
  lead_updated: <MdEdit />,
  status_changed: <MdSwapHoriz />,
  note_added: <MdNote />,
  lead_deleted: <MdDelete />,
};

const activityBubbleColorMap: Record<string, string> = {
  lead_created: "bg-green-100 text-green-600",
  lead_updated: "bg-blue-100 text-blue-600",
  status_changed: "bg-purple-100 text-purple-600",
  note_added: "bg-amber-100 text-amber-600",
  lead_deleted: "bg-red-100 text-red-600",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Won",
  "Lost",
];

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);

  const [lead, setLead] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loadingLead, setLoadingLead] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);

  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState("note");
  const [savingNote, setSavingNote] = useState(false);

  // Sales: inline status update
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [tab, setTab] = useState<"notes" | "activity">("notes");

  const fetchLead = async () => {
    try {
      setLoadingLead(true);
      const res = await api.get(`/leads/get/${id}`);
      const data = res.data.data;
      const leadData = data?.lead || data;
      setLead(leadData);
      setSelectedStatus(leadData.status || "New");
    } catch {
      toast.error("Failed to load lead");
    } finally {
      setLoadingLead(false);
    }
  };

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const res = await api.get(`/notes/lead/${id}`);
      setNotes(res.data.data || []);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoadingNotes(false);
    }
  };

  const fetchActivities = async () => {
    if (!isAdmin) {
      setLoadingActivities(false);
      return;
    }
    try {
      setLoadingActivities(true);
      const res = await api.get(`/activities/lead/${id}`);
      setActivities(res.data.data || []);
    } catch {
      toast.error("Failed to load activities");
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchLead();
    fetchNotes();
    fetchActivities();
  }, [id]);

  const addNote = async () => {
    if (!noteContent.trim()) return;
    try {
      setSavingNote(true);
      await api.post("/notes/create", {
        content: noteContent.trim(),
        leadId: id,
        type: noteType,
      });
      toast.success("Note added successfully");
      setNoteContent("");
      fetchNotes();
      if (isAdmin) fetchActivities();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add note");
    } finally {
      setSavingNote(false);
    }
  };

  // Sales user updates status inline (PUT /api/leads/update/:id with only status)
  const updateStatus = async () => {
    if (!selectedStatus || selectedStatus === lead?.status) return;
    try {
      setUpdatingStatus(true);
      await api.put(`/leads/update/${id}`, { status: selectedStatus });
      toast.success("Status updated successfully");
      fetchLead();
      if (isAdmin) fetchActivities();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loadingLead) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!lead) return null;

  const infoRows = [
    { label: "Email", value: lead.email },
    { label: "Phone", value: lead.phoneNumber },
    { label: "Source", value: lead.leadSource || "—" },
    { label: "Score", value: lead.score ?? 0 },
    {
      label: "Deal Value",
      value: lead.dealValue
        ? `$${Number(lead.dealValue).toLocaleString()}`
        : "—",
    },
    { label: "Assigned To", value: lead.assignedTo?.name || "—" },
    {
      label: "Created",
      value: lead.createdAt ? formatDate(lead.createdAt) : "—",
    },
  ];

  const backPath = isAdmin ? "/leads" : "/my-leads";

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate(backPath)}
        className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1 mb-5 transition-colors"
      >
        <FiArrowLeft size={14} /> {isAdmin ? "Back to Leads" : "Back to My Leads"}
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left panel: Lead info ────────────────────────────── */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {lead.leadName}
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">{lead.companyName}</p>
              </div>
              {/* Admin gets full edit; Sales gets no edit button */}
              {isAdmin && (
                <button
                  onClick={() => navigate(`/leads/edit/${lead._id}`)}
                  className="flex items-center gap-1 text-xs text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition"
                >
                  <FiEdit2 size={12} /> Edit
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <Badge label={lead.status} />
              <Badge label={lead.priority || "Low"} />
              {lead.leadSource && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
                  {lead.leadSource}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {infoRows.map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-gray-800 font-medium text-right max-w-[60%] break-all">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sales-only: Quick Status Update panel */}
          {!isAdmin && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Update Status
              </p>
              <select
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition mb-3"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={updateStatus}
                disabled={updatingStatus || selectedStatus === lead.status}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {updatingStatus ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <FiSave size={13} />
                )}
                {updatingStatus ? "Saving..." : "Save Status"}
              </button>
            </div>
          )}
        </div>

        {/* ── Right panel: Notes + Activities ─────────────────── */}
        <div className="xl:col-span-2 space-y-4">
          {/* Add Note form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Add Note</h3>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 focus:bg-white transition placeholder:text-gray-400"
              rows={3}
              placeholder="Write a note about this lead..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <div className="flex items-center gap-3 mt-3">
              <select
                className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
              >
                <option value="note">📝 Note</option>
                <option value="call">📞 Call</option>
                <option value="email">📧 Email</option>
                <option value="meeting">🤝 Meeting</option>
              </select>

              <button
                onClick={addNote}
                disabled={savingNote || !noteContent.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                {savingNote ? (
                  <>
                    <LoadingSpinner size="sm" /> Saving...
                  </>
                ) : (
                  <>
                    <FiSend size={13} /> Add Note
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setTab("notes")}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  tab === "notes"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/40"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <MdNote size={15} /> Notes ({notes.length})
              </button>

              {/* Activity tab only for Admin */}
              {isAdmin && (
                <button
                  onClick={() => setTab("activity")}
                  className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    tab === "activity"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/40"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <MdHistory size={15} /> Activity ({activities.length})
                </button>
              )}
            </div>

            <div className="p-4 space-y-3 max-h-[480px] overflow-y-auto">
              {/* Notes Tab */}
              {tab === "notes" && (
                <>
                  {loadingNotes ? (
                    <LoadingSpinner />
                  ) : notes.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <MdNote size={36} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-medium">No notes yet</p>
                      <p className="text-xs mt-1">Add the first note above</p>
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note._id}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base text-gray-500">
                              {noteIconMap[note.type] || <MdNote />}
                            </span>
                            <span className="text-xs font-semibold text-indigo-600 capitalize bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                              {note.type}
                            </span>
                            <span className="text-xs text-gray-400">
                              by {note.createdBy?.name || "—"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDate(note.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {note.content}
                        </p>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* Activity Tab (Admin only) */}
              {tab === "activity" && isAdmin && (
                <>
                  {loadingActivities ? (
                    <LoadingSpinner />
                  ) : activities.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <MdHistory
                        size={36}
                        className="mx-auto mb-2 opacity-30"
                      />
                      <p className="text-sm font-medium">No activity yet</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-100" />
                      <div className="space-y-4">
                        {activities.map((act) => (
                          <div
                            key={act._id}
                            className="flex gap-3 items-start relative"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0 z-10 shadow-sm ${
                                activityBubbleColorMap[act.type] ||
                                "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {activityIconMap[act.type] || <MdHistory />}
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                              <p className="text-sm text-gray-700">
                                {act.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {act.createdBy?.name || "System"} ·{" "}
                                {formatDate(act.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadDetails;