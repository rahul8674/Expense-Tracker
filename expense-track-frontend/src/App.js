import { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";
import "./App.css";

const App = () => {
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/expenses");
        const data = await response.json();
        // Convert string dates to Date objects (if needed)
        const expensesWithDates = data.map(exp => ({
          ...exp,
          date: new Date(exp.date),
        }));
        setExpenses(expensesWithDates);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);
  
  // Add new expense
  const addExpenseHandler = (expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };

  // Delete expense
  const deleteExpenseHandler = (expenseId) => {
    setExpenses((prevExpenses) => prevExpenses.filter(expense => expense._id !== expenseId));
  };

  return (
    <div className="app-container">
      <h1>Expense Tracker</h1>
      <ExpenseForm onAddExpense={addExpenseHandler} />
      <ExpenseSummary expenses={expenses} />
      <ExpenseList expenses={expenses} onDeleteExpense={deleteExpenseHandler} />
    </div>
  );
};

export default App;
