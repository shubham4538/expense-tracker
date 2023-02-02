import React from "react";
import { Link } from "react-router-dom";

function AllData({ type }) {
  const path = `/${type}/all${type}`;
  return (
    <div className="global-container block block-4">
      <span className="mb-1">
        All {type}
        <li className="fal fa-edit"></li>
      </span>
      <hr />
      <span className="last"></span>
      <span className="subtitle" style={{ flexGrow: 1 }}>
        Read, Update and Delete {type} Data
      </span>
      <div className="add-button">
        <Link to={path}>
          <button style={{ borderRadius: "25px" }}>
            Edit <li className="far fa-arrow-right ps-2"></li>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default AllData;
