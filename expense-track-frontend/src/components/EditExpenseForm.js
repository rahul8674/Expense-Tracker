import { useState } from "react";

const EditExpenseForm = ({ expense, onSave, onCancel }) => {
  // Format date properly for input fields
  const formattedDate = expense.date
    ? new Date(expense.date).toISOString().split("T")[0]
    : "";

  // State for form fields
  const [title, setTitle] = useState(expense.title || "");
  const [amount, setAmount] = useState(expense.amount || "");
  const [date, setDate] = useState(formattedDate);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title || !amount || !date) {
      console.error("All fields are required.");
      return;
    }

    const updatedExpense = { title, amount: Number(amount), date };
    const token = localStorage.getItem("token");

    if (!token) return console.error("User not authenticated.");
    if (!expense._id) return console.error("Expense ID is missing.");

    try {
      const response = await fetch(
        `http://localhost:5000/api/expenses/${expense._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedExpense),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update expense");
      }

      const updatedData = await response.json();
      onSave(updatedData);
    } catch (error) {
      console.error("Error updating expense:", error.message);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditExpenseForm;
