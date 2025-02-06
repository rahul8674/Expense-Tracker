import React from "react";
import ExpenseItem from "./ExpenseItem";

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  return (
    <div className="expense-list">
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        expenses.map((expense) => (
          <ExpenseItem key={expense._id} expense={expense} onDelete={onDeleteExpense} />
        ))
      )}
    </div>
  );
};

export default ExpenseList;

