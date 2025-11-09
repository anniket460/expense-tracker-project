import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AddExpenseForm from "../components/AddExpenseForm";
import EditExpenseModal from "../components/EditExpenseModal";
import CategoryPie from "../components/CategoryPie";
import MonthlyBar from "../components/MonthlyBar";

function Dashboard() {
  const { token, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editExpense, setEditExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch expenses");
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [token]);

  const handleCreated = (newExp) => {
    setExpenses((prev) => [newExp, ...prev]);
  };

  const handleUpdated = (updatedExp) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp._id === updatedExp._id ? updatedExp : exp))
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;
    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete expense");
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading your expenses...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-2">{error}</p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Logout
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">Your Expenses 💸</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <CategoryPie expenses={expenses} />
          <MonthlyBar expenses={expenses} />
        </div>

        <br></br>

        <AddExpenseForm onCreated={handleCreated} />

        <div className="bg-white p-6 rounded-xl shadow">
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No expenses found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {expenses.map((exp) => (
                <li
                  key={exp._id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{exp.title}</p>
                    <p className="text-sm text-gray-500">
                      {exp.category} • {new Date(exp.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold text-green-600">
                      ₹{exp.amount}
                    </span>
                    <button
                      onClick={() => setEditExpense(exp)}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {editExpense && (
        <EditExpenseModal
          expense={editExpense}
          onClose={() => setEditExpense(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}

export default Dashboard;
