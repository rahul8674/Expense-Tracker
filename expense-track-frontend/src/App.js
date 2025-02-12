import { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!token) return; // No token, skip fetch

      setLoading(true);
      setError(null); // Reset errors
      try {
        const response = await fetch("http://localhost:5000/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();
        const expensesWithDates = data.map((exp) => ({
          ...exp,
          date: new Date(exp.date),
        }));
        setExpenses(expensesWithDates);
      } catch (err) {
        setError("Error fetching expenses. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [token]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Error logging in. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add new expense
  const addExpenseHandler = (expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };

  // Delete expense
  const deleteExpenseHandler = (expenseId) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense._id !== expenseId)
    );
  };

  // Update expense
  const updateExpenseHandler = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense._id === updatedExpense._id ? updatedExpense : expense
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="app-container">
      {loading && <div className="loading-spinner">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {token ? (
        <>
          <h1>Expense Tracker</h1>
          <button onClick={handleLogout}>Logout</button>
          <ExpenseForm onAddExpense={addExpenseHandler} />
          <ExpenseSummary expenses={expenses} />
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={deleteExpenseHandler}
            onUpdateExpense={updateExpenseHandler}
          />
        </>
      ) : (
        <>
          {isRegistering ? (
            <Register onRegister={handleRegister} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Already have an account? Login" : "Create an account"}
          </button>
        </>
      )}
    </div>
  );
};

export default App;
