import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Index = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992); // Below 992px is tablet/mobile

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsMobile(true);
        setIsOpen(false); // hide on smaller screens by default
      } else {
        setIsMobile(false);
        setIsOpen(true); // show on large screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* Toggle Button (only visible on small screens) */}
      {isMobile && (
        <button
          className="btn   btn-light"
          onClick={() => setIsOpen(!isOpen)}
          style={{ position: "fixed", top: "10px", left: "110px",     zIndex: 1050 }}
        >
           {isOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Sidebar */}
      {isOpen && (
        <div
          className="bg-dark text-white p-3"
          style={{
            width: "150px",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            transition: "all 0.3s ease",
            zIndex: 1040,
          }}
        >
          <h4 className="mb-4">Expenzo</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/dashboard" className="nav-link text-white">
                Dashboard
              </Link>
            </li>

            {/* Income Dropdown */}
            <li className="nav-item mb-2">
              <button
                className="btn btn-dark w-100 text-start"
                data-bs-toggle="collapse"
                data-bs-target="#incomeMenu"
                aria-expanded="false"
                aria-controls="incomeMenu"
              >
                Income ▾
              </button>
              <div className="collapse ps-3" id="incomeMenu">
                <Link to="/income" className="nav-link text-white">
                  Income List
                </Link>
                <Link to="/income/add" className="nav-link text-white">
                  Add Income
                </Link>
              </div>
            </li>

            {/* Expense Dropdown */}
            <li className="nav-item mb-2">
              <button
                className="btn btn-dark w-100 text-start"
                data-bs-toggle="collapse"
                data-bs-target="#expenseMenu"
                aria-expanded="false"
                aria-controls="expenseMenu"
              >
                Expense ▾
              </button>
              <div className="collapse ps-3" id="expenseMenu">
                <Link to="/expense" className="nav-link text-white">
                  Expenses
                </Link>
                <Link to="/expense/add" className="nav-link text-white">
                  Add Expense
                </Link>
              </div>
            </li>

            {/* Date Picker */}
            <li className="nav-item mb-2">
              <Link to="/date" className="nav-link text-white">
                📅  Date
              </Link>
            </li>

            {/* Logout */}
            <li className="nav-item">
              <button
                className="nav-link text-white btn btn-dark w-100 text-start"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("_id");
                  navigate("/");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Index;
