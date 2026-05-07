import { Link } from "react-router-dom";
import type { Lead } from "../utils/type";


const LeadCard = ({lead,onDelete}:{lead:Lead,onDelete:any}) => {
  return (
    <div className="bg-white p-5 rounded shadow">

      <h2 className="text-xl font-bold">
        {lead.leadName}
      </h2>

      <p>{lead.companyName}</p>

      <p>{lead.email}</p>

      <p className="mt-2">
        Status:
        <span className="font-bold ml-2">
          {lead.status}
        </span>
      </p>

      <div className="flex gap-3 mt-4">

        <Link
          to={`/lead/${lead._id}`}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          View
        </Link>

        <Link
          to={`/edit-lead/${lead._id}`}
          className="bg-yellow-500 text-white px-3 py-2 rounded"
        >
          Edit
        </Link>

        <button
          onClick={()=>onDelete(lead._id)}
          className="bg-red-500 text-white px-3 py-2 rounded"
        >
          Delete
        </button>

      </div>

    </div>
  )
}

export default LeadCard;