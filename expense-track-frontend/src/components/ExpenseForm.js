import { useState } from "react";

const ExpenseForm = ({ onAddExpense }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title || !amount || !date) {
      alert("All fields are required!");
      return;
    }

    const newExpense = { title, amount: Number(amount), date };
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add expense");
      }

      const savedExpense = await response.json();
      onAddExpense(savedExpense);

      // Reset form fields after successful submission
      setTitle("");
      setAmount("");
      setDate("");
    } catch (error) {
      console.error("Error adding expense:", error.message);
      alert("Failed to add expense. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          required
        />
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
