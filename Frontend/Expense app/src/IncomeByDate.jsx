import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import Index from "./Index";
import "react-calendar/dist/Calendar.css";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("_id");

const IncomeExpenseByDate = () => {
  const [date, setDate] = useState(new Date());
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data for a specific date
  const fetchData = async (selectedDate) => {
    try {
      setLoading(true);
      setError("");

      const formattedDate = selectedDate.toISOString().split("T")[0];

      const incomeRes = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/income/date/${userId}/${formattedDate}`,
        { headers: { Authorization: ` ${token}` } }
      );

      const expenseRes = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/expense/date/${userId}/${formattedDate}`,
        { headers: { Authorization: ` ${token}` } }
      );

      setIncome(incomeRes.data.Income || []);
      setExpense(expenseRes.data.Expense || []);
    } catch (e) {
      // Handle 404 (no data) gracefully
      if (e.response?.status === 404) {
        setIncome([]);
        setExpense([]);
        setError("");
      } else {
        setError(e.response?.data?.message || "Failed to fetch data");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load today’s data on mount
  useEffect(() => {
    fetchData(date);
  }, []);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    fetchData(selectedDate);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Index />

      {/* Main content */}
      <div className="container mt-4" style={{ marginLeft: "160px" }}>
        <div className="date p-3">
          <h3 className="mb-3">Income & Expense by Date</h3>

          <Calendar onChange={handleDateChange} value={date} />

          {loading && <p className="mt-3">Loading data...</p>}
          {error && <p className="text-danger mt-3">{error}</p>}

          {!loading && (
            <div className="mt-4">
              <h5>Selected Date: {date.toDateString()}</h5>

              <div className="mt-3">
                <h6>Income</h6>
                {income.length > 0 ? (
                  <ul className="list-group">
                    {income.map((item) => (
                      <li key={item._id} className="list-group-item">
                        {item.description}: Rs.{item.amount}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No income found</p>
                )}
              </div>

              <div className="mt-3">
                <h6>Expense</h6>
                {expense.length > 0 ? (
                  <ul className="list-group">
                    {expense.map((item) => (
                      <li key={item._id} className="list-group-item">
                        {item.description}: Rs.{item.amount}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No expense found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseByDate;
