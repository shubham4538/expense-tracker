import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Icon from "../../Resources/Image/IconShadow.png";

function Bars({ login, details }) {
  const location = useLocation();
  const currentLink = location.pathname;
  const [sidebar, setSidebar] = useState(false);

  document.onclick = function (e) {
    if (
      e.target.className !== "side-bar show" &&
      e.target.className !== "fas fa-bars"
    ) {
      // console.log(e.target.className);
      setSidebar(false);
    }
  };

  const LogOut = () => {
    if (window.confirm("Are you sure to Logout ?")) {
      localStorage.removeItem("expensesAccDetails");
      window.location.reload();
    }
  };

  return (
    <>
      <div className="nav-bar">
        <div className="burger" onClick={() => setSidebar(!sidebar)}>
          <i className="fas fa-bars" style={{ fontSize: "19px" }}></i>
        </div>
        <div>
          {currentLink.includes("/Home")
            ? "Dashboard"
            : currentLink.includes("/Income")
            ? currentLink.includes("/allIncome")
              ? "Income Data"
              : "Income"
            : currentLink.includes("/Expense")
            ? currentLink.includes("/allExpense")
              ? "Expense Data"
              : "Expense"
            : currentLink.includes("/Calendar")
            ? "Calendar"
            : currentLink.includes("/Settings")
            ? "Settings"
            : ""}
        </div>
        <div className="icon">
          <img src={Icon} style={{ height: "28px" }} />
        </div>
      </div>
      <div className={sidebar ? "side-bar show" : "side-bar"}>
        {login ? (
          <div className="user">
            <img src={details.Image} className="user-dp" />
            <div className="usernames">
              <span>{details.FullName}</span>
              <span className="username">
                {localStorage.getItem("expensesAccDetails")}
              </span>
            </div>
          </div>
        ) : (
          <div className="user">
            <Link to={"/Login"}>
              <button>Login</button>
            </Link>
          </div>
        )}
        <hr style={{ color: "#fff", opacity: 0.55, margin: 0 }} />
        <div className="links">
          <Link
            to={"/Home"}
            className={currentLink.includes("/Home") ? "link active" : "link"}
          >
            <i className="fas fa-grid-2"></i>
            <div>Dashboard</div>
          </Link>
          <Link
            to={"/Income"}
            className={currentLink.includes("/Income") ? "link active" : "link"}
          >
            <i className="fas fa-chart-line-up"></i>
            <div>Income</div>
          </Link>
          <Link
            to={"/Expense"}
            className={
              currentLink.includes("/Expense") ? "link active" : "link"
            }
          >
            <i className="fas fa-chart-line-down"></i>
            <div>Expense</div>
          </Link>
          <Link
            to={"/Calendar"}
            className={
              currentLink.includes("/Calendar") ? "link active" : "link"
            }
          >
            <i className="fas fa-calendar-range"></i>
            <div>Calendar</div>
          </Link>
          <Link
            to={"/Settings"}
            className={
              currentLink.includes("/Settings") ? "link active" : "link"
            }
          >
            <i className="fas fa-gear"></i>
            <div>Settings</div>
          </Link>
          <div className="log">
            <i className="fas fa-power-off"></i>
            <div className="link" onClick={LogOut}>
              Logout
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Bars;
