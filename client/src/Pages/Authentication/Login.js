import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Axios from "axios";
import icon from "../../Resources/Image/IconShadow.png";

function Login() {
  const navigate = useNavigate();
  const [loading, isLoading] = useState(false);

  const schema = yup.object().shape({
    Username: yup.string().required(),
    Password: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    isLoading(true);
    Axios.post("https://expense-tracker-one-indol.vercel.app/login", data).then(
      (res) => {
        isLoading(false);
        if (res.data.notExists) {
          console.log(res.data.notExists);
          alert(res.data.notExists);
        } else if (res.data.notPassword) {
          alert(res.data.notPassword);
        } else {
          console.log("ok");
          alert("Login Successfull :)");
          localStorage.setItem("expensesAccDetails", data.Username);
          navigate("/Home");
        }
      }
    );
  };

  return window.navigator.userAgent.match(/Android/i) ? (
    <div className="form-block mobile-auth">
      <div className="form-left">
        <div className="glass">
          <div className="top">
            <div className="mb-2">
              <img src={icon} style={{ height: "50px" }} />
            </div>
            <div className="paragraph">
              Welcome Back to
              <Link to="/">
                <span className="bold"> EXPENSSO</span>
              </Link>
              . Just enter your
              <b> Login </b>
              details and continue tracking your expenses and incomes.
            </div>
          </div>
          <div className="input-container">
            <div className="inputs">
              <div className="box">
                <span>Username</span>
                <input
                  type="text"
                  name="Username"
                  {...register("Username")}
                  autoComplete="off"
                />
                <span style={{ fontSize: "13px", color: "red" }}>
                  {errors["Username"]?.message}
                </span>
              </div>
              <div className="box">
                <span>Password</span>
                <input
                  type="password"
                  name="Password"
                  {...register("Password")}
                  autoComplete="off"
                />
                <span style={{ fontSize: "13px", color: "red" }}>
                  {errors["Password"]?.message}
                </span>
              </div>
              <div className="box">
                {loading ? (
                  <button>...</button>
                ) : (
                  <button onClick={handleSubmit(onSubmit)}>Submit</button>
                )}
              </div>
            </div>
          </div>
          <div className="bottom">
            <span>Don't have an Account ?</span>
            <Link to="/SignUp">
              <span className="bold">SigUp</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="form-block">
      <div className="form-left">
        <div className="glass">
          <div className="top">
            <div className="mb-2">
              <img src={icon} style={{ height: "50px" }} />
            </div>
            <div className="paragraph">
              Welcome Back to
              <Link to="/">
                <span className="bold"> EXPENSSO</span>
              </Link>
              . Just enter your
              <b> Login </b>
              details and continue tracking your expenses and incomes.
            </div>
          </div>
          <div className="bottom">
            <span>Don't have an Account ?</span>
            <Link to="/SignUp">
              <span className="bold">SigUp</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="form-right">
        <h2
          className="bold mt-3 mb-4"
          style={{ fontSize: "25px", color: "#000" }}
        >
          Login
        </h2>
        <div className="input-container">
          <div className="inputs">
            <div className="box">
              <span>Username</span>
              <input
                type="text"
                name="Username"
                {...register("Username")}
                autoComplete="off"
              />
              <span style={{ fontSize: "13px", color: "red" }}>
                {errors["Username"]?.message}
              </span>
            </div>
            <div className="box">
              <span>Password</span>
              <input
                type="password"
                name="Password"
                {...register("Password")}
                autoComplete="off"
              />
              <span style={{ fontSize: "13px", color: "red" }}>
                {errors["Password"]?.message}
              </span>
            </div>
            <div className="box">
              {loading ? (
                <button className="cursor-loading">...</button>
              ) : (
                <button onClick={handleSubmit(onSubmit)}>Submit</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
