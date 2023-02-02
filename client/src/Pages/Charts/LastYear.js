import React, { useEffect, useState } from "react";

function LastYear({ details, type }) {
  const [lastyeartotal, setLastYeartotal] = useState(0);
  const [lastyearname, setLastYearname] = useState(
    "No data inserted for last Year"
  );

  useEffect(() => {
    const lastyear = new Date().getFullYear() - 1;
    if (Object.keys(details.Details).length !== 0) {
      if (details.Details[type] !== undefined) {
        const lastyeararray = details.Details[type][lastyear];
        if (lastyeararray) {
          let add = 0;
          lastyeararray.map((obj) => {
            add += obj.amount;
            setLastYeartotal(add);
          });
          setLastYearname(`Total ${type} for Last Year (${lastyear})`);
        } else {
          setLastYearname(`No ${type} data found for last Year`);
        }
      }
    }
  });

  return (
    <div className="global-container block block-3">
      <span className="mb-1">
        <span>Last Year</span>
        <li className="fal fa-alarm-clock"></li>
      </span>
      <hr />
      <div className="last">
        <h3 style={{ margin: 0 }}>₹ {lastyeartotal}</h3>
      </div>
      <span className="subtitle">{lastyearname}</span>
    </div>
  );
}

export default LastYear;
