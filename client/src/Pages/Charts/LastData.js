import React, { useState } from "react";

function LastData({ details, type, iconC }) {
  const [lastData, setLastData] = useState({
    description: "",
    amount: 0,
    time: `No Last Data found !`,
  });

  useState(() => {
    if (Object.keys(details.Details).length !== 0) {
      if (details.Details[type] !== undefined) {
        const lastdataallyear = Object.keys(details.Details[type]).map(
          (year) => {
            const lastdataeachyear = details.Details[type][year].reduce(
              (a, b) => {
                return new Date(a.time) > new Date(b.time) ? a : b;
              }
            );
            return lastdataeachyear;
          }
        );
        const lastdata = lastdataallyear.reduce((a, b) => {
          return new Date(a.time) > new Date(b.time) ? a : b;
        });
        const newlastdata = {
          ...lastdata,
          time: lastdata.time.split(" ").slice(0, 5).join(" "),
          category: `(${lastdata.category})`,
        };
        setLastData(newlastdata);
      }
    }
  }, []);

  return (
    <div className="global-container block block-1">
      <span className="mb-1">
        Last {type}{" "}
        <i className="fal fa-alarm-clock" style={{ color: iconC }}></i>
      </span>
      <hr />
      <div className="last">
        <h3 style={{ margin: 0 }}>₹ {lastData.amount}</h3>
        <span>
          {lastData.description} {lastData.category}
        </span>
      </div>
      <span className="subtitle">{lastData.time}</span>
    </div>
  );
}

export default LastData;
