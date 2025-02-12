import React, { useState } from "react";
import EditExpenseForm from "./EditExpenseForm";

const ExpenseItem = ({ expense, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
    }

    if (!expense._id) {
      console.error("Expense ID is missing.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/expenses/${expense._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        onDelete(expense._id); // Update UI after successful deletion
      } else {
        const errorData = await response.json();
        console.error("Failed to delete expense:", errorData);
        alert(errorData.message || "Failed to delete expense. Try again.");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("An error occurred while deleting the expense.");
    }
  };

  // Format date properly
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(expense.date));

  const handleSave = (updatedExpense) => {
    onUpdate(updatedExpense);
    setIsEditing(false);
  };

  return (
    <div className="expense-item">
      {isEditing ? (
        <EditExpenseForm
          expense={expense}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div>
            <h3>{expense.title}</h3>
            <p className="expense-date">{formattedDate}</p>
          </div>
          <div>
            <span className="expense-amount">${expense.amount}</span>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ✏️
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseItem;
