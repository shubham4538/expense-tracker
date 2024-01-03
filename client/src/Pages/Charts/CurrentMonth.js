import React, { useEffect, useState } from "react";

function LastMonth({ details, type }) {
  const [profit, setProfit] = useState(false);
  const [monthTotal, setMonthTotal] = useState(0);
  const [lastMonthTotal, setLastMonthTotal] = useState(0);
  const [lastMonthName, setLastMonthName] = useState("");
  const [monthName, setMonthName] = useState(
    "No data inserted for Current Month"
  );

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const monthArray = (num) => {
      if (num == 1) {
        if (new Date().getMonth() === 0) {
          return details.Details[type][currentYear - 1].filter((month) => {
            return new Date(month.time).getMonth() === 11;
          });
        } else {
          return details.Details[type][currentYear].filter((month) => {
            return (
              new Date(month.time).getMonth() === new Date().getMonth() - num
            );
          });
        }
      } else {
        return details.Details[type][currentYear].filter((month) => {
          return (
            new Date(month.time).getMonth() === new Date().getMonth() - num
          );
        });
      }
    };

    const monthTotal = (montharray) => {
      return montharray.map((date) => date.amount).reduce((a, b) => a + b);
    };

    if (Object.keys(details.Details).length !== 0) {
      if (details.Details[type] !== undefined) {
        if (details.Details[type][currentYear] !== undefined) {
          const prevmontharray = monthArray(1);
          const montharray = monthArray(0);

          if (montharray.length > 0) {
            const monthtotal = monthTotal(montharray);
            setMonthTotal(monthtotal);
            setMonthName(
              `Total ${type} for Current Month (${new Date(
                montharray[0]?.time
              ).toLocaleString("default", {
                month: "long",
              })})`
            );
            if (prevmontharray.length > 0) {
              const lastmonthtotal = monthTotal(prevmontharray);
              setLastMonthTotal(lastmonthtotal);
              if (monthtotal !== 0) {
                const isWhatPercentOf = (prev, curr) => {
                  return Math.abs(Math.round(100 - (curr / prev) * 100));
                };
                if (lastmonthtotal > monthtotal) {
                  setProfit(true);
                  setLastMonthName(
                    `${isWhatPercentOf(
                      lastmonthtotal,
                      monthtotal
                    )}% lesser than Last Month (${lastMonthTotal})`
                  );
                } else {
                  setLastMonthName(
                    `${isWhatPercentOf(
                      lastmonthtotal,
                      monthtotal
                    )}% greater than Last Month (${lastMonthTotal})`
                  );
                }
              }
            }
          } else {
            setLastMonthTotal(0);
            setMonthName(`No ${type} data found for Current Month`);
          }
        }
      }
    }
  });

  return (
    <div className="global-container block block-2">
      <span className="mb-1">
        <span>Current Month</span>
        <li className="fal fa-alarm-clock"></li>
      </span>
      <hr />
      <div className="last">
        <h3 style={{ margin: 0 }}>₹ {monthTotal}</h3>
      </div>
      <span className="subtitle">{monthName}</span>
      <span
        className="subtitle"
        style={{ color: `${profit ? "#63FAFF" : "#FF6384"}` }}
      >
        {lastMonthName}
      </span>
    </div>
  );
}

export default LastMonth;
