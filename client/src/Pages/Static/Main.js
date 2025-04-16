import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import icons from "../../Resources/Image/IconShadow.png";
import landing from "../../Resources/Image/landing.svg";
// import { ReactComponent as ReactLogo } from "../../drawkit-illustration.svg";

function Main() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState("");
  useEffect(() => {
    const account = localStorage.getItem("expensesAccDetails");
    if (account !== null) {
      setUser(account);
      setLogin(true);
    } else {
      console.log("null");
    }
  }, []);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    header: {
      display: "flex",
      padding: "20px 40px",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerleft: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
    },
    mainContent: {
      display: "flex",
      padding: "10px 40px",
      gap: "10px",
    },
    textSection: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    headline: {
      fontSize: "3.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      marginBottom: "24px",
    },
    subtext: {
      fontSize: "1rem",
      marginBottom: "20px",
    },
    buildButton: {
      background: "linear-gradient(to right, #f43f5e, #d946ef)",
      border: "none",
      padding: "10px 20px",
      fontSize: "1rem",
      borderRadius: "8px",
      width: "fit-content",
    },
    authButton: {
      background: "rgba(196, 196, 196, 0.38)",
      border: "none",
      padding: "7px 14px",
      fontSize: "1rem",
      borderRadius: "8px",
      width: "fit-content",
    },
    imageContainer: {
      flex: 1,
      minWidth: "380px",
    },
    landingImage: {
      width: "100%",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerleft}>
          <img src={icons} style={{ width: "20px" }} alt="" />
          <span className="bold" style={{ fontSize: "20px" }}>
            EXPENSSO
          </span>
        </div>
        <Link to={login ? "/Home" : "/Login"} style={styles.authButton}>
          {login ? user : "Login"}
        </Link>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.textSection}>
          <div style={styles.headline}>
            Track.
            <br />
            Save.
            <br />
            Thrive.
          </div>
          <p style={styles.subtext}>
            Stay on top of your finances effortlessly. Expensso helps you
            understand where your money goes—so you can take control and plan
            with confidence.
          </p>
          <Link to={login ? "/Home" : "/Login"} style={styles.buildButton}>
            Get Started
          </Link>
        </div>

        <div className="image-container" style={styles.imageContainer}>
          <img src={landing} style={styles.landingImage} />
        </div>
      </div>
    </div>
  );
}

export default Main;
