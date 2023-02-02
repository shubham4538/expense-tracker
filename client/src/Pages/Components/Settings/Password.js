import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useOutletContext } from "react-router-dom";
import Axios from "axios";

function Password() {
  const [details] = useOutletContext();
  const [formChange, setFormChange] = useState(false);
  const username = localStorage.getItem("expensesAccDetails");

  const schema = yup.object().shape({
    Oldpass: yup
      .string()
      .test(
        "Oldpass",
        "Enter Old Password !!!",
        (value) => details.Password === value
      ),
    Newpass: yup
      .string()
      .required("Enter a new Password")
      .test(
        "Newpass",
        "Choose new Password !!!",
        (value) => !(details.Password === value)
      ),
    Newpass2: yup
      .string()
      .oneOf([yup.ref("Newpass"), null], "Passwords must match")
      .required("Re-enter your password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    data = { ...data, FullName: details.FullName, Username: username };
    Axios.post(
      "https://expense-tracker-one-indol.vercel.app/password",
      data
    ).then((res) => {
      if (res.data.err) {
        alert("Something went wrong :(");
      } else {
        alert("Updated Password :)");
        window.location.reload();
      }
    });
  };

  return (
    <div className="global-container">
      <form
        id="pass-form"
        className="setting"
        onChange={() => {
          setFormChange(true);
        }}
      >
        <h5 style={{ margin: "0" }}>Change Password</h5>
        <div className="text-field">
          <div className="error">
            <span>Enter Old Password</span>
            <span style={{ fontSize: "13px", color: "#ff0000c9" }}>
              {errors["Oldpass"]?.message}
            </span>
          </div>
          <input name="Oldpass" type="password" {...register("Oldpass")} />
        </div>
        <div className="text-field">
          <div className="error">
            <span>Enter New Password</span>
            <span style={{ fontSize: "13px", color: "#ff0000c9" }}>
              {errors["Newpass"]?.message}
            </span>
          </div>
          <input name="Newpass" type="password" {...register("Newpass")} />
        </div>
        <div className="text-field">
          <div className="error">
            <span>Enter New Password again</span>
            <span style={{ fontSize: "13px", color: "#ff0000c9" }}>
              {errors["Newpass2"]?.message}
            </span>
          </div>
          <input name="Newpass2" type="password" {...register("Newpass2")} />
        </div>
        <div
          className={formChange ? "ok-cancel-butt" : "hidden ok-cancel-butt"}
        >
          <button
            type="submit"
            className="buttons"
            onClick={handleSubmit(onSubmit)}
          >
            OK
          </button>
          <button
            className="buttons"
            onClick={(e) => {
              setFormChange(false);
              document.getElementById("pass-form").reset();
            }}
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}

export default Password;
