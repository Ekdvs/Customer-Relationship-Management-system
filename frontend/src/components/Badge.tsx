const statusColors: Record<string, string> = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Contacted: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Qualified: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Proposal: "bg-purple-50 text-purple-700 border-purple-200",
  Won: "bg-green-50 text-green-700 border-green-200",
  Lost: "bg-red-50 text-red-700 border-red-200",
  High: "bg-red-50 text-red-700 border-red-200",
  Medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Low: "bg-gray-50 text-gray-600 border-gray-200",
};

const Badge = ({ label }: { label: string }) => {
  const color = statusColors[label] || "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${color}`}>
      {label}
    </span>
  );
};

export default Badge;