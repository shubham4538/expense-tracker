import React, { useEffect, useState } from "react";
import Bars from "../Static/Bars";
import Axios from "axios";
import EachData from "./EachData";

function AllExpense() {
  const [login, setLogin] = useState(false);
  const [details, setDetails] = useState({});
  const [open, setOpen] = useState("");
  const [dataArray, setDataArray] = useState();
  const [order, setOrder] = useState(false);

  const sorting = (col) => {
    const sorter = document.querySelectorAll(".sorter");
    if (order) {
      const sortedData = [...dataArray].sort((a, b) => {
        if (a[col].length > 20) {
          if (new Date(a[col]) !== "Invalid Date") {
            return new Date(a[col]) > new Date(b[col]) ? 1 : -1;
          }
        } else {
          return a[col] > b[col] ? 1 : -1;
        }
      });
      sorter.forEach((elem) => {
        elem.classList.remove("fa-caret-up");
        elem.classList.add("fa-caret-down");
        if (elem.classList.contains(col)) {
          elem.classList.remove("fa-caret-down");
          elem.classList.add("fa-caret-up");
        }
      });
      setDataArray(sortedData);
      setOrder((prev) => !prev);
    } else {
      const sortedData = [...dataArray].sort((a, b) => {
        if (a[col].length > 20) {
          if (new Date(a[col]) !== "Invalid Date") {
            return new Date(a[col]) < new Date(b[col]) ? 1 : -1;
          }
        } else {
          return a[col] < b[col] ? 1 : -1;
        }
      });
      sorter.forEach((elem) => {
        elem.classList.remove("fa-caret-up");
        elem.classList.add("fa-caret-down");
        if (elem.classList.contains(col)) {
          elem.classList.remove("fa-caret-up");
          elem.classList.add("fa-caret-down");
        }
      });
      setDataArray(sortedData);
      setOrder((prev) => !prev);
    }
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
            setDataArray(Object.values(res.data[0].Details.Expense).flat());
            setLogin(true);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return dataArray && dataArray.length !== 0 ? (
    <>
      <Bars login={login} details={details} />
      <div className="authenticason">
        <div className="d-flex justify-content-center">
          <div className="tabel">
            <table>
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th className="hover" onClick={() => sorting("description")}>
                    <div className="th-container">
                      <span>Description</span>
                      <li className="sorter description fas fa-caret-down"></li>
                    </div>
                  </th>
                  <th className="hover" onClick={() => sorting("category")}>
                    <div className="th-container">
                      <span>Category</span>
                      <li className="sorter category fas fa-caret-down"></li>
                    </div>
                  </th>
                  <th className="hover" onClick={() => sorting("time")}>
                    <div className="th-container">
                      <span>Date</span>
                      <li className="sorter time fas fa-caret-down"></li>
                    </div>
                  </th>
                  <th className="hover" onClick={() => sorting("amount")}>
                    <div className="th-container">
                      <span>Amount</span>
                      <li className="sorter amount fas fa-caret-down"></li>
                    </div>
                  </th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {dataArray.map(
                  ({ amount, description, time, category, _id }, index) => {
                    const data = {
                      amount: amount,
                      description: description,
                      time: time,
                      category: category,
                      _id: _id,
                    };
                    return (
                      <EachData
                        data={data}
                        index={index}
                        open={open}
                        setOpen={setOpen}
                        type={"Expense"}
                        dataArray={dataArray}
                        setDataArray={setDataArray}
                        key={data._id}
                      />
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <Bars login={login} details={details} />
      <div className="authenticason">
        <div className="no-data">
          <img
            src={require("../../Resources/Image/File searching-amico (2).png")}
            style={{ width: "380px" }}
          />
          <div className="no-data-text">No data to show</div>
        </div>
      </div>
    </>
  );
}

export default AllExpense;
