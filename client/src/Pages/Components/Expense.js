import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Bars from "../Static/Bars";
import BarChart from "../Charts/BarChart";
import LastData from "../Charts/LastData";
import LastMonth from "../Charts/CurrentMonth";
import LastYear from "../Charts/LastYear";
import AllData from "../Charts/AllData";
import Axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Expense() {
  const [details, setDetails] = useState({});
  const [login, setLogin] = useState(false);
  const [expyear, setExpyear] = useState();
  const [isExp, setIsExp] = useState(false);
  const [expenseSnip, setExpenseSnip] = useState([]);
  const MySwal = withReactContent(Swal);

  const schema = yup.object().shape({
    Description: yup.string().required(),
    Amount: yup.number().typeError("Enter Amount").required(),
    Date: yup.string().required(),
    Category: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const yr = parseInt(data.Date.substr(0, 4));
    const mn = parseInt(data.Date.substr(5, 2));
    const dy = parseInt(data.Date.substr(8, 2));
    const hr = parseInt(data.Date.substr(11, 2));
    const min = parseInt(data.Date.substr(14, 2));
    const sc = parseInt(data.Date.substr(17, 2));
    const date = new Date(yr, mn - 1, dy, hr, min, sc);

    const newData = {
      ...data,
      Date: date.toString(),
      Type: "Expense",
      Fullname: details.FullName,
      Username: localStorage.getItem("expensesAccDetails"),
    };

    Axios.post("http://localhost:3001/addData", newData).then((res) => {
      if (res.data.err) {
        console.log("Error");
      } else {
        console.log(res.data.success);
        window.location.reload();
      }
    });
  };

  const setValue = (e) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const time = now.toISOString().slice(0, 19);
    e.target.value = time;
  };

  const snipDummy = (details) => {
    const dummy = [];
    if (Object.keys(details.Details).length !== 0) {
      if (details.Details.Expense !== undefined) {
        Object.keys(details.Details.Expense).map((year) =>
          details.Details.Expense[year].map((data) => {
            const dum = {
              desc: data.description,
              amt: data.amount,
              ctg: data.category,
              count: 1,
            };
            if (
              dummy.some(
                (item) =>
                  item.desc === data.description &&
                  item.amt === data.amount &&
                  item.ctg === data.category
              )
            ) {
              dummy[
                dummy.findIndex(
                  (item) =>
                    item.desc === data.description &&
                    item.amt === data.amount &&
                    item.ctg === data.category
                )
              ].count += 1;
            } else {
              dummy.push(dum);
            }
          })
        );
      }
    }
    const reducedDummy = dummy.filter((data) => data.count > 4);
    return reducedDummy;
  };

  const addSnippet = (data) => {
    Swal.fire({
      title: `Add data for ${data.Description}(${data.Category}) amounting ₹${data.Amount}`,
      text: "Enter Date (time optional)",
      input: "text",
      inputPlaceholder: "Format: yyyy-mm-dd hr:mn",
      showCancelButton: true,
      confirmButtonText: "Add data",
      preConfirm: (title) => {
        const d = new Date(title);
        try {
          if (title === "" || title === null) {
            throw new Error("Enter Valid Date");
          } else if (d instanceof Date && !isNaN(d) === false) {
            throw new Error("Enter Valid Format");
          } else {
            const newData = {
              ...data,
              Date: d.toString(),
              Type: "Expense",
              Fullname: details.FullName,
              Username: localStorage.getItem("expensesAccDetails"),
            };
            console.log(newData);
            Axios.post("http://localhost:3001/addData", newData).then((res) => {
              if (res.data.result) {
                return true;
              } else {
                throw new Error("Somthing went wrong !");
              }
            });
          }
        } catch (error) {
          Swal.showValidationMessage(error);
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Your Data has been added",
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      }
    });
  };

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
            setExpenseSnip(snipDummy(details));
            setLogin(true);
            if (details.Details.Expense) {
              setExpyear(
                Object.keys(details.Details.Expense)[
                  Object.keys(details.Details.Expense).length - 1
                ]
              );
              setIsExp(true);
            }
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
      <div className="authenticason">
        <div className="blocks">
          <LastData details={details} type={"Expense"} />
          <LastMonth details={details} type={"Expense"} />
          <LastYear details={details} type={"Expense"} />
          <AllData type={"Expense"} />
        </div>
        <div className="chart flex-row d-flex">
          <div className="global-container charts chart-1">
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
          <div className="global-container charts chart-2 d-flex flex-column">
            <div className="parent-snippet">
              {expenseSnip.map((data) => {
                const sendData = {
                  Description: data.desc,
                  Category: data.ctg,
                  Amount: data.amt,
                };
                return (
                  <div
                    className="snippet"
                    onClick={() => addSnippet(sendData)}
                    key={data.amt}
                  >
                    {data.desc} ₹{data.amt}
                    <li className="far fa-plus"></li>
                  </div>
                );
              })}
            </div>
            <h5 className="chart-header">
              <li className="far fa-plus" style={{ color: "#FF6384" }}></li>
              Add Expense Data
            </h5>
            <div className="form">
              <div className="data">
                <span>Add Description</span>
                <input
                  type="text"
                  name="Description"
                  {...register("Description")}
                  autoComplete="off"
                />
                <span style={{ fontSize: "13px", color: "#c50000" }}>
                  {errors["Description"]?.message}
                </span>
              </div>
              <div className="data">
                <span>Add Category</span>
                <select
                  id="categories"
                  name="categories"
                  {...register("Category")}
                  style={{ color: "#fff" }}
                >
                  <option hidden value="">
                    Select
                  </option>
                  <option value="House">House</option>
                  <option value="Travelling">Travelling</option>
                  <option value="Food">Food</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Health">Health</option>
                  <option value="Investment">Investment</option>
                  <option value="Personal">Personal</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Gift">Gift</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
                <span style={{ fontSize: "13px", color: "#c50000" }}>
                  {errors["Category"]?.message}
                </span>
              </div>
              <div className="data">
                <span>Add Amount</span>
                <input
                  type="number"
                  name="Amount"
                  {...register("Amount")}
                  autoComplete="off"
                />
                <span style={{ fontSize: "13px", color: "#c50000" }}>
                  {errors["Amount"]?.message}
                </span>
              </div>
              <div className="data">
                <span>Add Date</span>
                <input
                  type="datetime-local"
                  name="Date"
                  step="1"
                  onClick={setValue}
                  // defaultValue={time}
                  autoComplete="off"
                  {...register("Date")}
                />
              </div>
              <span style={{ fontSize: "13px", color: "#c50000" }}>
                {errors["Date"]?.message}
              </span>
              <div className="add-button">
                <button onClick={handleSubmit(onSubmit)}>Submit</button>
              </div>
            </div>
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

export default Expense;
