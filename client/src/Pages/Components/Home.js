import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import BarChart from "../Charts/BarChart";
import LineChart from "../Charts/LineChart";
import LastData from "../Charts/LastData";
import Bars from "../Static/Bars";

const Home = () => {
  const [details, setDetails] = useState({});
  const [login, setLogin] = useState(false);
  const [expyear, setExpyear] = useState();
  const [incyear, setIncyear] = useState();
  const [isExp, setIsExp] = useState(false);
  const [isInc, setIsInc] = useState(false);
  const [loading, setLoading] = useState(true);

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
            // console.log("Error");
          } else {
            const details = res.data[0];
            setDetails(details);
            setLogin(true);
            if (details?.Details?.Income !== undefined) {
              setIncyear(Object.keys(details.Details.Income)[0]);
              setIsInc(true);
            }
            if (details?.Details?.Expense !== undefined) {
              setExpyear(Object.keys(details.Details.Expense)[0]);
              setIsExp(true);
            }
          }
        });
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      console.log("Login");
    }
  }, []);

  const TotalAmount = (data, type) => {
    if (Object.keys(data.Details).length !== 0) {
      if (data.Details[type] !== undefined) {
        const nums = Object.keys(data?.Details[type])?.map((year) => {
          return data?.Details[type][year]?.reduce((total, each2) => {
            return total + each2.amount;
          }, 0);
        });
        return nums.reduce((total, amt) => {
          return total + amt;
        }, 0);
      } else return "No Data";
    } else return "No Data";
  };

  const FirstDate = (data, type) => {
    if (Object.keys(data.Details).length !== 0) {
      if (data.Details[type] !== undefined) {
        const something = Object.keys(data?.Details[type])?.map((year) => {
          return data?.Details[type][year]?.reduce((a, b) => {
            return new Date(a.time) < new Date(b.time) ? a : b;
          });
        });
        return `From ${something[0].time.split(" ").slice(0, 5).join(" ")}`;
      }
    } else return "";
  };

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
      <div className="authenticason">
        <div style={{ margin: " 10px" }}>
          <h3 style={{ margin: 0 }}>
            <b>Account Overview</b>
          </h3>
          <span className="name-span">{details.FullName}</span>
        </div>
        <div className="row-1">
          <div className="global-container charts chart-1">
            <div className="chart-header">
              <h5 style={{ marginBottom: 0 }}>
                <li
                  className="fal fa-chart-line-up"
                  style={{ color: "#63faff" }}
                ></li>
                Income Chart
              </h5>
              {isInc ? (
                <span className="subtitle">
                  For year
                  <div className="select-parent">
                    {incyear}
                    <select
                      className="select-class"
                      onChange={(e) => setIncyear(e.target.value)}
                      value={incyear}
                    >
                      {Object.keys(details.Details.Income).map((val) => {
                        return (
                          <option value={val} key={val}>
                            {val}
                          </option>
                        );
                      })}
                    </select>
                    <li className="far fa-exchange"></li>
                  </div>
                </span>
              ) : (
                <span>No Income Data to show</span>
              )}
            </div>
            <div className="main-chart">
              <LineChart
                color={"#63faff"}
                yearData={isInc ? details.Details.Income[incyear] : {}}
              />
            </div>
          </div>
          <div className="global-container charts chart-2">
            <div className="chart-header">
              <h5 style={{ marginBottom: 0 }}>
                <li
                  className="fal fa-chart-line-down"
                  style={{ color: "#FF6384" }}
                ></li>
                Expense Chart
              </h5>
              {isExp ? (
                <span className="subtitle">
                  For year
                  <div className="select-parent">
                    {expyear}
                    <select
                      className="select-class"
                      onChange={(e) => setExpyear(e.target.value)}
                      value={expyear}
                    >
                      {Object.keys(details.Details.Expense).map((val) => {
                        return (
                          <option value={val} key={val}>
                            {val}
                          </option>
                        );
                      })}
                    </select>
                    <li className="far fa-exchange"></li>
                  </div>
                </span>
              ) : (
                <span>No Expense Data to show</span>
              )}
            </div>
            <div className="main-chart">
              <BarChart
                yearData={isExp ? details.Details.Expense[expyear] : {}}
              />
            </div>
          </div>
        </div>
        <div className="blocks">
          <LastData details={details} type={"Income"} iconC={"#63faff"} />
          <LastData details={details} type={"Expense"} iconC={"#ff6384"} />
          <div className="global-container block block-3">
            <span className="mb-1">
              Total Income
              <i className="fal fa-wallet" style={{ color: "#63faff" }}></i>
            </span>
            <hr />
            <div className="last">
              <h3 style={{ margin: 0 }}>₹ {TotalAmount(details, "Income")}</h3>
            </div>
            <span className="subtitle">{FirstDate(details, "Income")}</span>
          </div>
          <div className="global-container block block-4">
            <span className="mb-1">
              Total Expense
              <i className="fal fa-wallet" style={{ color: "#FF6384" }}></i>
            </span>
            <hr />
            <div className="last">
              <h3 style={{ margin: 0 }}>₹ {TotalAmount(details, "Expense")}</h3>
            </div>
            <span className="subtitle">{FirstDate(details, "Expense")}</span>
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
};

export default Home;
