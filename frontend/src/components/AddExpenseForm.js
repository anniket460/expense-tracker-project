import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Entertainment",
  "Other",
];

export default function AddExpenseForm({ onCreated }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().slice(0, 10), // yyyy-mm-dd for <input type="date">
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // keep amount numeric but allow empty while typing
    setForm((f) => ({
      ...f,
      [name]: name === "amount" ? value.replace(/[^\d.]/g, "") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          amount: Number(form.amount),
          category: form.category,
          date: form.date, // backend accepts ISO or date string
          description: form.description.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add expense");
      onCreated?.(data); // let parent update the list
      // reset minimal fields
      setForm((f) => ({ ...f, title: "", amount: "", description: "" }));
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow mb-6"
    >
      <h2 className="text-lg font-semibold mb-4">Add Expense</h2>

      {err && <p className="text-red-500 text-sm mb-2">{err}</p>}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="border rounded-lg p-2 md:col-span-2"
          required
        />
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="border rounded-lg p-2"
          inputMode="decimal"
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border rounded-lg p-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Notes (optional)"
        className="border rounded-lg p-2 w-full mt-3"
        rows={2}
      />

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </div>
    </form>
  );
}
