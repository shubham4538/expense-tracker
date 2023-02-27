import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Axios from "axios";

import icon from "../../Resources/Image/IconShadow.png";
import Tags from "./Tags";

// phone: yup.object({
//   code: yup.string().matches(/^\+\d+$/i),
//   number: yup.number().max(10),
// }),

function SignUp() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [mail, setMail] = useState([]);
  const [phone, setPhone] = useState([]);

  //Schema Validation
  const schema = yup.object().shape({
    Username: yup
      .string()
      .test(
        "Username",
        "Username already exists",
        (value) => !user.includes(value)
      )
      .required("Enter a Username"),
    Full_name: yup.string().required("Enter your full name"),
    Email: yup
      .string()
      .test("Email", "Email already in use", (value) => !mail.includes(value))
      .email()
      .required(),
    Phone: yup
      .number()
      .test("Phone", "Number already in use", (value) => !phone.includes(value))
      .typeError("Enter your phone number")
      .min(1000000000, "Enter a valid number")
      .max(9999999999, "Enter a valid number")
      .required("A phone number is required"),
    Password: yup.string().required(),
    Password_2: yup
      .string()
      .oneOf([yup.ref("Password"), null], "Passwords must match")
      .required("Re-enter your password"),
  });

  //Form Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    //Getting data for non-reusable purpose
    Axios.get("https://expense-tracker-one-indol.vercel.app/collections").then(
      (res) => {
        const objectArr = res.data;
        const arrName = objectArr.map((names) => names.name);
        setUser(arrName);
      }
    );

    //Username space disallow
    const userName = document.getElementById("Username");
    userName.onkeydown = (e) => {
      if (e.keyCode == 32) {
        e.preventDefault();
        alert("Space values are not allowed for username");
      }
    };
  }, []);

  useEffect(() => {
    //Getting Email and phone number for non-reuse
    //New useEffect sideeffect as user as it changes
    user.forEach((name) => {
      Axios.post(
        "https://expense-tracker-one-indol.vercel.app/eachCollectionData",
        {
          collection: name,
        }
      ).then((res) => {
        setMail((old) => [...old, res.data[0].Email]);
        setPhone((old) => [...old, res.data[0].Phone]);
      });
    });
  }, [user]);

  const onSubmit = (details) => {
    Axios.post(
      "https://expense-tracker-one-indol.vercel.app/create",
      details
    ).then((res) => {
      if (res.data.err) {
        console.log("Error");
        alert("Something went wrong :(");
      } else {
        alert("Account creation Successfull :)");
        console.log(details);
        localStorage.setItem("expensesAccDetails", details.Username);
        navigate("/Home");
      }
    });
  };

  return !window.navigator.userAgent.match(/Android/i) ? (
    <div className="form-block">
      <div className="form-left">
        <div className="glass">
          <div className="top">
            <div className="mb-2">
              <img src={icon} style={{ height: "50px" }} />
            </div>
            <div className="paragraph">
              <b>SignUp </b>
              to
              <Link to="/">
                <span className="bold"> EXPENSSO </span>
              </Link>
              and start tracking your expenses and incomes.
            </div>
          </div>
          <div className="bottom">
            <span>Already have an Account ?</span>
            <Link to="/Login">
              <span className="bold">Login</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="form-right">
        <h2
          className="bold mt-3 mb-4"
          style={{ fontSize: "25px", color: "#000" }}
        >
          SignUp
        </h2>
        <div className="input-container">
          <div className="inputs">
            {Tags.inputs.map((input) => {
              return (
                <div key={input.name} className="box">
                  <span>{input.label}</span>
                  <input
                    type={input.type}
                    name={input.name}
                    id={input.name}
                    {...register(input.name)}
                  />
                  <span style={{ fontSize: "13px", color: "red" }}>
                    {errors[input.name]?.message}
                  </span>
                </div>
              );
            })}
            <div className="box">
              <button onClick={handleSubmit(onSubmit)}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="form-block mobile-auth">
      <div className="form-left">
        <div className="glass">
          <div className="top">
            <div className="mb-2">
              <img src={icon} style={{ height: "50px" }} />
            </div>
            <div className="paragraph">
              <b>SignUp </b>
              to
              <Link to="/">
                <span className="bold"> EXPENSSO </span>
              </Link>
              and start tracking your expenses and incomes.
            </div>
          </div>
          <div className="input-container">
            <div className="inputs">
              {Tags.inputs.map((input) => {
                return (
                  <div key={input.name} className="box">
                    <span>{input.label}</span>
                    <input
                      type={input.type}
                      name={input.name}
                      id={input.name}
                      {...register(input.name)}
                    />
                    <span style={{ fontSize: "13px", color: "red" }}>
                      {errors[input.name]?.message}
                    </span>
                  </div>
                );
              })}
              <div className="box">
                <button onClick={handleSubmit(onSubmit)}>Submit</button>
              </div>
            </div>
          </div>
          <div className="bottom">
            <span>Already have an Account ?</span>
            <Link to="/Login">
              <span className="bold">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
