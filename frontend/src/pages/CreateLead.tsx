import { useNavigate } from "react-router-dom";
import LeadForm from "../components/LeadForm";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import toast from "react-hot-toast";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

const CreateLead = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any, data: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/leads/create", { ...data, dealValue: Number(data.dealValue) });
      toast.success("Lead created successfully!");
      navigate("/leads");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create lead");
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Lead</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to add a new lead</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <LeadForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateLead;