import React from "react";

const ExpenseItem = ({ expense, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${expense._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(expense._id); // Remove item from UI
      } else {
        console.error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Ensure the date is a valid Date object
  const dateObject = new Date(expense.date); 
  const formattedDate = isNaN(dateObject) ? "Invalid Date" : dateObject.toLocaleDateString("en-US");

  return (
    <div className="expense-item">
      <div>
        <h3>{expense.title}</h3>
        <p className="expense-date">{formattedDate}</p>
      </div>
      <div>
        <span className="expense-amount">${expense.amount}</span>
        <button className="delete-btn" onClick={handleDelete}>🗑️</button>
      </div>
    </div>
  );
};

export default ExpenseItem;

  