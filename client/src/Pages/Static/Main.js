import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import icons from "../../Resources/Image/IconShadow.png";
// import { ReactComponent as ReactLogo } from "../../drawkit-illustration.svg";

function Main() {
  const [login, setLogin] = useState(false);
  useEffect(() => {
    const account = localStorage.getItem("expensesAccDetails");
    if (account !== null) {
      setLogin(true);
    } else {
      console.log("null");
    }
  }, []);

  return (
    <div className="verify">
      {/* <ReactLogo className="svg" /> */}
      <div className="template">
        <img src={icons} />
        <span className="bold">EXPENSSO</span>
      </div>
      <div className="text my-3">
        <span>
          The one and only Application for handling your daily expenses and
          income
        </span>
        <span>Open your Expensso Account now with just some steps</span>
      </div>
      <div className="register">
        {login ? (
          <div className="bttn">
            <Link to={"/Home"}>
              Welcome
              <li
                className="far fa-arrow-right"
                style={{
                  paddingLeft: "10px",
                  bottom: "-1px",
                  position: "relative",
                }}
              ></li>
            </Link>
          </div>
        ) : (
          <>
            <div className="bttn">
              <Link to="/Login">Login</Link>
            </div>
            |
            <div className="bttn">
              <Link to="/SignUp">SignUp</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Main;
