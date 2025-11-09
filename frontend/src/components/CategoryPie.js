import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CategoryPie({ expenses }) {
  // aggregate by category
  const totals = expenses.reduce((acc, e) => {
    const key = e.category || "Other";
    acc[key] = (acc[key] || 0) + Number(e.amount || 0);
    return acc;
  }, {});
  const data = Object.entries(totals).map(([name, value]) => ({ name, value }));

  // simple color palette (auto)
  const COLORS = [
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
    "#f472b6",
    "#22d3ee",
    "#c084fc",
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">Category-wise Spend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
