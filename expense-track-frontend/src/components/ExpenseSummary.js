const ExpenseSummary = ({ expenses }) => {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
    return (
      <div className="expense-summary">
        <h2>Expense Summary</h2>
        <p>Total Expenses: ${totalAmount.toFixed(2)}</p>
      </div>
    );
  };
  
  export default ExpenseSummary;
  