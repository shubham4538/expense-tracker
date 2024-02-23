import React, { useEffect, useState } from "react";
import Axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  Description: yup.string().required(),
  Category: yup.string().required(),
  Date: yup.string().required(),
  Amount: yup.number().required(),
});

function EachData({
  data,
  index,
  open,
  setOpen,
  type,
  dataArray,
  setDataArray,
}) {
  const username = localStorage.getItem("expensesAccDetails");
  const dateTime = data.time.split(" ").slice(0, 5).join(" ");
  const [details, setDetails] = useState();

  const time = new Date(data.time);

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    try {
      if (username) {
        Axios.post(
          "https://expense-tracker-one-indol.vercel.app/eachCollectionData",
          {
            collection: username,
          }
        ).then((res) => {
          if (res.data.err) {
            console.log("Error");
          } else {
            setDetails(res.data[0]);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const onSubmit = (form) => {
    const yr = parseInt(form.Date.substr(0, 4));
    const mn = parseInt(form.Date.substr(5, 2));
    const dy = parseInt(form.Date.substr(8, 2));
    const hr = parseInt(form.Date.substr(11, 2));
    const min = parseInt(form.Date.substr(14, 2));
    const sc = parseInt(form.Date.substr(17, 2));
    const date = new Date(yr, mn - 1, dy, hr, min, sc).toString();

    if (
      form.Description !== data.description ||
      form.Category !== data.category ||
      form.Date !== time ||
      form.Amount !== data.amount
    ) {
      const newData = {
        ...form,
        Date: date,
        id: data._id,
        year: new Date(form.Date).getFullYear().toString(),
        type: type,
        username: username,
      };
      Axios.post(
        "https://expense-tracker-one-indol.vercel.app/update",
        newData
      ).then((res) => {
        console.log(res);
        if (res.data.success) {
          if (res.data.success.modifiedCount > 0) {
            alert("Data Updated Successfully!");
            window.location.reload();
          } else {
            alert("Something went Wrong!!!");
          }
        } else {
          alert("Something went Wrong!!!");
        }
      });
    } else {
      console.log("change atleast");
    }
  };

  const deleteData = (e) => {
    if (window.confirm("Are you sure ?")) {
      Axios.delete(
        `https://expense-tracker-one-indol.vercel.app/delete${data._id}`,
        {
          data: {
            username: username,
            year: new Date(time).getFullYear().toString(),
            type: type,
            userId: details._id,
          },
        }
      ).then((res) => {
        console.log(res);
        if (res.data.success) {
          alert(res.data.success);
          const newData = dataArray.filter((val) => {
            return val._id != data._id;
          });
          e.target.parentElement.parentElement.parentElement.classList.add(
            "remove-tr"
          );
          e.target.parentElement.parentElement.parentElement.ontransitionend =
            function () {
              this.classList.remove("remove-tr");
              setDataArray(newData);
            };
        }
      });
    }
  };

  return (
    <tr style={{ position: "relative" }}>
      <td>{index + 1}</td>
      {!(open === `radio-${index}`) ? (
        <>
          <td>{data.description}</td>
          <td>{data.category}</td>
          <td className="date-time">
            <div>{dateTime}</div>
          </td>
          <td>{data.amount}</td>
          <td>
            <div className="functions">
              <label className="far fa-edit">
                <input
                  type="radio"
                  name="edit"
                  value={`radio-${index}`}
                  onChange={() => {
                    setOpen(`radio-${index}`);
                  }}
                />
              </label>
              <label
                className="far fa-trash"
                onClick={(e) => deleteData(e)}
              ></label>
            </div>
          </td>
        </>
      ) : (
        <>
          <td>
            <input
              type="text"
              name="Description"
              defaultValue={data.description}
              {...register("Description")}
            />
          </td>
          <td>
            <select
              id="categories"
              name="Category"
              {...register("Category")}
              style={{ color: "#fff" }}
              defaultValue={data.category}
            >
              <option hidden value="">
                Select
              </option>
              <option value="House">House</option>
              <option value="Travelling">Travelling</option>
              <option value="Food">Food</option>
              <option value="Utilities">Utilities</option>
              <option value="Insurance">Insurance</option>
              <option value="Health">Health</option>
              <option value="Investment">Investment</option>
              <option value="Personal">Personal</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Turf">Turf</option>
              <option value="Gift">Gift</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </td>
          <td>
            <input
              style={{ width: "230px" }}
              type="datetime-local"
              name="Date"
              step="1"
              defaultValue={time}
              {...register("Date")}
            />
          </td>

          <td>
            <input
              type="number"
              name=""
              id=""
              defaultValue={data.amount}
              {...register("Amount")}
            />
          </td>
          <td>
            <div className="functions">
              <label
                className={"far fa-circle-check"}
                onClick={handleSubmit(onSubmit)}
              ></label>
              <label className="far fa-times-circle">
                <input
                  type="radio"
                  name="edit"
                  value={`radio-${index}`}
                  onChange={() => setOpen("")}
                />
              </label>
            </div>
          </td>
        </>
      )}
    </tr>
  );
}

export default EachData;
