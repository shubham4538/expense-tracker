import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Axios from "axios";

import Main from "./Pages/Static/Main";
import Bars from "./Pages/Static/Bars";
import Home from "./Pages/Components/Home";
import Income from "./Pages/Components/Income";
import AllIncome from "./Pages/Components/AllIncome";
import Expense from "./Pages/Components/Expense";
import AllExpense from "./Pages/Components/AllExpense";
import Calendar from "./Pages/Components/Calendar";
import Settings from "./Pages/Components/Settings";
import Password from "./Pages/Components/Settings/Password";
import Personal from "./Pages/Components/Settings/Personal";
import Login from "./Pages/Authentication/Login";
import SignUp from "./Pages/Authentication/SignUp";

import "./Resources/Styles/bootstrap.css";
import "./Resources/Styles/bootstrap-icons.css";
import "./Resources/Styles/fontawesome-icons.css";
import "./Resources/Main.css";
import "./Resources/Body.css";
import "./Resources/Chart.css";
import "./Resources/Auth.css";
import "./Resources/Calender.css";
import "./Resources/Bars.css";
import "./Resources/Settings.css";

export const LoginContext = React.createContext();
export const DetailsContext = React.createContext();

function App() {
  const [login, setLogin] = useState(false);
  const [details, setDetails] = useState({});
  useEffect(() => {
    try {
      const data = localStorage.getItem("expensesAccDetails");
      if (data) {
        Axios.post(
          "https://expense-tracker-one-indol.vercel.app/eachCollectionData",
          {
            collection: data,
          }
        ).then((res) => {
          if (res.data.err) {
            console.log("Error");
          } else {
            setDetails(res.data[0]);
            setLogin(true);
          }
        });
      }
    } catch (err) {
      console.log(err);
      console.log("Login");
    }
  }, []);

  const Header = (props) => {
    return <div className="authentication">{props.children}</div>;
  };

  return (
    <LoginContext.Provider value={{ login, setLogin }}>
      <DetailsContext.Provider value={{ details, setDetails }}>
        <Router>
          <Header>
            <Routes>
              <Route exact path="/" element={<Main />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Income" element={<Income />} />
              <Route path="/Income/allIncome" element={<AllIncome />} />
              <Route path="/Expense" element={<Expense />} />
              <Route path="/Expense/allExpense" element={<AllExpense />} />
              <Route path="/Calendar" element={<Calendar />} />
              <Route path="/Settings" element={<Settings />}>
                {/* <Route index element={<Personal />} /> */}
                <Route index element={<Navigate to="Personal" />}></Route>
                <Route path="Personal" element={<Personal />} />
                <Route path="Password" element={<Password />} />
              </Route>
            </Routes>
          </Header>
        </Router>
      </DetailsContext.Provider>
    </LoginContext.Provider>
  );
}

export default App;
