import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Axios from "axios";
import { Oval } from "react-loader-spinner";
import Bars from "../Static/Bars";

function Settings() {
  const location = useLocation();
  const currentLink = location.pathname;
  const [details, setDetails] = useState({});
  const [allData, setAllData] = useState({});
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const url =
    "https://res.cloudinary.com/shubham4538/image/upload/v1655829691/React-bank/Blank/blank-profile_b5is0b.png";
  const imgError = (e) => {
    e.target.src = url;
  };

  useEffect(() => {
    try {
      Axios.get(
        "https://expense-tracker-one-indol.vercel.app/collections"
      ).then((res) => {
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
        Axios.post(
          "https://expense-tracker-one-indol.vercel.app/eachCollectionData",
          {
            collection: data,
          }
        ).then((res) => {
          if (res.data.err) {
            console.log("Error");
          } else {
            const details = res.data[0];
            setDetails(details);
            setLogin(true);
          }
        });
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return loading ? (
    <>
      <Bars login={login} details={details} />
      <div className="authenticason">
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Oval
            height={60}
            width={60}
            color="#a63bff"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#373753"
            strokeWidth={3}
            strokeWidthSecondary={3}
          />
        </div>
      </div>
    </>
  ) : login ? (
    <>
      <Bars login={login} details={details} />
      <div className="authenticason" style={{ padding: "0" }}>
        <div
          className={
            window.navigator.userAgent.match(/Android/i)
              ? "setting-container mobile-setting"
              : "setting-container"
          }
        >
          <div className="setting-sidebar">
            <Link to="/Settings/Personal">
              <div
                className={
                  currentLink.includes("Personal")
                    ? "setting-side active-side"
                    : "setting-side"
                }
              >
                <i className="fas fa-user"></i>
                <span>Personal</span>
              </div>
            </Link>
            <Link to="/Settings/Password">
              <div
                className={
                  currentLink.includes("Password")
                    ? "setting-side active-side"
                    : "setting-side"
                }
              >
                <i className="fas fa-key"></i>
                <span>Password</span>
              </div>
            </Link>
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
