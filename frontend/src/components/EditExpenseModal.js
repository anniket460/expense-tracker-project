import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function EditExpenseModal({ expense, onClose, onUpdated }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    date: expense.date.slice(0, 10),
    description: expense.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/expenses/${expense._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update expense");
      onUpdated(data); // update in parent
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <h2 className="text-lg font-semibold mb-4">Edit Expense</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full mb-3"
            required
          />
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full mb-3"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full mb-3"
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Bills</option>
            <option>Shopping</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full mb-3"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full mb-3"
            rows={2}
            placeholder="Notes"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
