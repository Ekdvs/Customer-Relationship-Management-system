import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DashboardChart = ({ stats }: any) => {
    const data = [
        { name: "Won", value: stats.won },
        { name: "Lost", value: stats.lost },
        { name: "Qualified", value: stats.qualified },
        { name: "New", value: stats.newLeads },
    ].filter((d) => d.value > 0);

    const COLORS = ["#22c55e", "#ef4444", "#6366f1", "#f59e0b"];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-sm">
                    <p className="font-semibold text-gray-700">{payload[0].name}</p>
                    <p className="text-gray-500">{payload[0].value} leads</p>
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6 flex items-center justify-center h-64">
                <p className="text-gray-400">No data to display</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Lead Distribution</h2>
            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={3}
                        label={({ name, percent = 0 }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                        } labelLine>
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DashboardChart;