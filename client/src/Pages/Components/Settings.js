import Axios from "axios";
import React, { useEffect, useState } from "react";
import Bars from "../Static/Bars";
import { Link, Outlet, useLocation } from "react-router-dom";

function Settings() {
  const location = useLocation();
  const currentLink = location.pathname;
  const [details, setDetails] = useState({});
  const [allData, setAllData] = useState({});
  const [login, setLogin] = useState(false);
  const url =
    "https://res.cloudinary.com/shubham4538/image/upload/v1655829691/React-bank/Blank/blank-profile_b5is0b.png";
  const imgError = (e) => {
    e.target.src = url;
  };

  useEffect(() => {
    try {
      Axios.get("http://localhost:3001/collections").then((res) => {
        const alldetails = res.data;
        const arrName = alldetails.map((names) => names.name);
        setAllData(arrName);
      });
    } catch (err) {}
  }, []);

  useEffect(() => {
    try {
      const data = localStorage.getItem("expensesAccDetails");
      if (data) {
        Axios.post("http://localhost:3001/eachCollectionData", {
          collection: data,
        }).then((res) => {
          if (res.data.err) {
            console.log("Error");
          } else {
            const details = res.data[0];
            setDetails(details);
            setLogin(true);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return login ? (
    <>
      <Bars login={login} details={details} />
      <div className="authenticason" style={{ padding: "0" }}>
        <div className="setting-container">
          <div className="setting-sidebar">
            <div
              className={
                currentLink.includes("Personal")
                  ? "setting-side active-side"
                  : "setting-side"
              }
            >
              <i className="fas fa-user"></i>
              <span>
                <Link to="/Settings/Personal">Personal</Link>
              </span>
            </div>
            <div
              className={
                currentLink.includes("Password")
                  ? "setting-side active-side"
                  : "setting-side"
              }
            >
              <i className="fas fa-key"></i>
              <span>
                <Link to="/Settings/Password">Password</Link>
              </span>
            </div>
          </div>
          <div className="settings">
            <Outlet context={[details, allData]} />
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <Bars login={login} details={details} />
      <div className="authenticason">
        <div>You need to login first</div>
      </div>
    </>
  );
}

export default Settings;
