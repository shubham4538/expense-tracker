import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Axios from "axios";

function Personal() {
  const [details, alldetails] = useOutletContext();
  const username = localStorage.getItem("expensesAccDetails");
  const [toggle, setToggle] = useState(false);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState();
  const [photo, setPhoto] = useState();
  const [isfile, setIsFile] = useState(false);
  const [imageLoad, setImageLoad] = useState(false);
  const [formChange, setFormChange] = useState(false);
  const [userName, setUserName] = useState(username);
  const [email, setEmail] = useState(details.Email);
  const [fullName, setFullName] = useState(details.FullName);

  //Schema Validation
  const schema = yup.object().shape({
    Fullname: yup.string().required("Enter your full name"),
    Username: yup
      .string()
      .test(
        "Username",
        "Username already exists",
        (value) => !alldetails.includes(value) || value === username
      )
      .required("Enter a Username"),
    Email: yup
      .string()
      // .test("Email", "Email already in use", (value) => false)
      .email()
      .required(),
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
    Axios.get("https://expense-tracker-one-indol.vercel.app/imageFiles").then(
      (res) => {
        setImages(res.data.resources);
        // For folder images
        // setImages(res.data);
      }
    );
  }, []);

  const changeHandler = (event) => {
    setFile(event.target.files[0]);
    setPhoto(URL.createObjectURL(event.target.files[0]));
    setIsFile(true);
  };

  const fakeInput = () => {
    document.getElementById("file").click();
  };

  const ImageSubmit = (e) => {
    // Loader
    setImageLoad(true);
    function base64(file) {
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      }).then((result) => {
        const data = {
          user: localStorage.getItem("expensesAccDetails"),
          fullName: details.FullName,
          change: "image",
          base: result,
        };
        Axios.post(
          "https://expense-tracker-one-indol.vercel.app/imageUpdate",
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
          console.log(res.data);
          if (res.data.success) {
            alert(res.data.success);
            window.location.reload();
            // End reload
            setImageLoad(false);
          } else {
            alert(res.data.error);
          }
        });
      });
    }
    base64(file);
  };

  const imageChange = (e) => {
    const imageName = e.target.src;
    console.log(imageName);
    const data = {
      user: localStorage.getItem("expensesAccDetails"),
      fullName: details.FullName,
      change: "image",
      value: imageName,
    };
    Axios.post(
      "https://expense-tracker-one-indol.vercel.app/setting",
      data
    ).then(() => {
      window.location.reload();
    });
  };

  const onSubmit = (data) => {
    console.log(data);
    data = { ...data, OldUser: username, OldName: details.FullName };
    console.log(data);
    Axios.post(
      "https://expense-tracker-one-indol.vercel.app/changePersonal",
      data
    ).then((res) => {
      if (res.data.result) {
        localStorage.setItem("expensesAccDetails", data.Username);
        window.location.reload();
      }
    });
  };

  return (
    <>
      <div className="setting global-container" style={{ gap: "10px" }}>
        <h5 style={{ margin: "0" }}>Change Image</h5>
        <div className="img-block">
          <img
            src={details.Image}
            className="change-img"
            // onError={imgError}
            alt=""
          />
          <span>Change Image for {details.FullName.split(" ")[0]}</span>
          <i
            className={toggle ? "fas fa-angle-up" : "fas fa-angle-down"}
            style={{ marginRight: "15px", cursor: "pointer" }}
            onClick={() => {
              setToggle(!toggle);
            }}
          ></i>
        </div>
        <div
          className={toggle ? "image-drop-down show-image" : "image-drop-down"}
        >
          <h6 style={{ margin: "0" }}>Select from these</h6>
          <div className="option-images">
            {images.map((image, key) => {
              return (
                <div key={key}>
                  <img
                    className="change-img"
                    src={image.secure_url}
                    alt=""
                    // For folder images
                    // src={
                    //   require(`../Resources/userProfilePicture/${image}`)
                    //     .default
                    // }
                    onClick={imageChange}
                  ></img>
                </div>
              );
            })}
          </div>
          <div className="file-box">
            <input
              type="file"
              name="File"
              id="file"
              accept="image"
              onChange={changeHandler}
            />
            {isfile ? (
              (() => {
                if (file.type.includes("image")) {
                  return (
                    <div className="file-name">
                      <h6>{file.name}</h6>
                      <button
                        className={
                          imageLoad ? "buttons ms-2 cursor" : "buttons ms-2"
                        }
                        onClick={(e) => ImageSubmit(e)}
                      >
                        <div
                          className={imageLoad ? "pointer" : ""}
                          style={{ position: "absolute" }}
                        ></div>
                        <div
                          className={imageLoad ? "update-loader" : ""}
                          style={{ position: "absolute" }}
                        ></div>
                        <img src={photo} alt="" className="preview-image" />
                        Update
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <button className="buttons me-2" onClick={fakeInput}>
                        Browse
                      </button>
                      <h6 style={{ color: "red" }}>*Select only Image files</h6>
                    </div>
                  );
                }
              })()
            ) : (
              <button className="buttons" onClick={fakeInput}>
                Browse
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="global-container">
        <form
          id="name-form"
          className="setting"
          onChange={() => {
            setFormChange(true);
          }}
        >
          <h5 style={{ margin: "0" }}>Change Image</h5>
          <div className="text-field">
            <div className="error">
              <span>Change Full Name</span>
              <span style={{ fontSize: "13px", color: "#ff0000c9" }}>
                {errors["Fullname"]?.message}
              </span>
            </div>
            <input
              type="text"
              defaultValue={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              name="Fullname"
              {...register("Fullname")}
            />
          </div>
          <div className="text-field">
            <div className="error">
              <span>Change Username</span>
              <span style={{ fontSize: "13px", color: "#ff0000c9" }}>
                {errors["Username"]?.message}
              </span>
            </div>
            <input
              type="text"
              defaultValue={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              name="Username"
              {...register("Username")}
            />
          </div>
          <div className="text-field">
            <div className="error">
              <span>Change Email</span>
              <span style={{ fontSize: "13px", color: "#ff0000c9" }}>
                {errors["Email"]?.message}
              </span>
            </div>
            <input
              type="text"
              defaultValue={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              name="Email"
              {...register("Email")}
            />
          </div>
          <div
            className={formChange ? "ok-cancel-butt" : "hidden ok-cancel-butt"}
          >
            <button
              className="buttons"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              OK
            </button>
            <button
              className="buttons"
              onClick={(e) => {
                setFormChange(false);
                document.getElementById("name-form").reset();
                e.preventDefault();
              }}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Personal;
