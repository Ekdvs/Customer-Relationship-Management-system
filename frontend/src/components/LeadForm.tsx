import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { FiSave } from "react-icons/fi";

const LeadForm = ({ onSubmit, initialData, loading }: any) => {
  const [formData, setFormData] = useState(
    initialData || {
      leadName: "",
      companyName: "",
      email: "",
      phoneNumber: "",
      leadSource: "Website",
      status: "New",
      dealValue: 0,
    }
  );

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "dealValue" ? Number(value) : value,
    });
  };

  const inputClass =
    "w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition placeholder:text-gray-400";
  const labelClass =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

  return (
    <form onSubmit={(e) => onSubmit(e, formData)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Lead Name *</label>
          <input name="leadName" placeholder="John Doe" className={inputClass} onChange={handleChange} value={formData.leadName} required />
        </div>
        <div>
          <label className={labelClass}>Company Name *</label>
          <input name="companyName" placeholder="Acme Corp" className={inputClass} onChange={handleChange} value={formData.companyName} required />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input name="email" type="email" placeholder="john@acme.com" className={inputClass} onChange={handleChange} value={formData.email} required />
        </div>
        <div>
          <label className={labelClass}>Phone Number *</label>
          <input name="phoneNumber" placeholder="+1 234 567 890" className={inputClass} onChange={handleChange} value={formData.phoneNumber} required />
        </div>
        <div>
          <label className={labelClass}>Lead Source</label>
          <select name="leadSource" className={inputClass} value={formData.leadSource} onChange={handleChange}>
            <option value="Website">Website</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select name="status" className={inputClass} value={formData.status} onChange={handleChange}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Deal Value ($)</label>
          <input type="number" name="dealValue" placeholder="0" className={inputClass} onChange={handleChange} value={formData.dealValue} min={0} />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          {loading ? <LoadingSpinner size="sm" /> : <FiSave size={14} />}
          {loading ? "Saving..." : "Save Lead"}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;