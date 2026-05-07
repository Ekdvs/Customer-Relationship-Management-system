import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeadForm from "../components/LeadForm";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { FiArrowLeft } from "react-icons/fi";

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await api.get(`/leads/get/${id}`);
        // The backend getLeadById returns { data: { lead, notes, activities } }
        // Handle both response shapes
        const data = res.data.data;
        setLead(data?.lead || data);
      } catch {
        toast.error("Failed to load lead");
        navigate("/leads");
      } finally {
        setFetching(false);
      }
    };
    fetchLead();
  }, [id]);

  const handleSubmit = async (e: any, data: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put(`/leads/update/${id}`, { ...data, dealValue: Number(data.dealValue) });
      toast.success("Lead updated successfully!");
      navigate("/leads");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <button onClick={() => navigate("/leads")} className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1 mb-3 transition-colors">
            <FiArrowLeft size={14} /> Back to Leads
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Lead</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update the lead information below</p>
        </div>
        {fetching ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <LeadForm onSubmit={handleSubmit} initialData={lead} loading={loading} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditLead;