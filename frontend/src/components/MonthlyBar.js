import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function keyFromDate(d) {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // e.g., 2025-11
}

export default function MonthlyBar({ expenses }) {
  // group by YYYY-MM
  const map = expenses.reduce((acc, e) => {
    const k = keyFromDate(e.date || e.createdAt);
    acc[k] = (acc[k] || 0) + Number(e.amount || 0);
    return acc;
  }, {});
  // sort by month ascending
  const data = Object.entries(map)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => (a.month > b.month ? 1 : -1));

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">Monthly Spend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `₹${v}`} />
            <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
