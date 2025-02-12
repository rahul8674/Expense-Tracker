import React from "react";
import ExpenseItem from "./ExpenseItem";

const ExpenseList = React.memo(({ expenses = [], onDeleteExpense, onUpdateExpense }) => {
  return (
    <div className="expense-list">
      {expenses.length === 0 ? (
        <p className="no-expenses">No expenses found. Start adding some! 💰</p>
      ) : (
        expenses.map((expense) => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            onDelete={onDeleteExpense}
            onUpdate={onUpdateExpense}
          />
        ))
      )}
    </div>
  );
});

export default ExpenseList;

