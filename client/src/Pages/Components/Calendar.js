import React, { useState, useContext } from "react";
import Bars from "../Static/Bars";
import { LoginContext, DetailsContext } from "../../App";
import Axios from "axios";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import FullCalender from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

function Calendar() {
  const username = localStorage.getItem("expensesAccDetails");
  const { login, setLogin } = useContext(LoginContext);
  const { details, setDetails } = useContext(DetailsContext);
  const [events, setEvents] = useState(details?.Events || []);
  const MySwal = withReactContent(Swal);

  const AddEvent = (info) => {
    MySwal.fire({
      title: "Enter Event Name",
      input: "text",
      // inputPlaceholder: "input",
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: (title) => {
        try {
          if (title === "" || title === null) {
            throw new Error("Enter Valid Details");
          } else {
            const sampleEvent = {
              title: title,
              start: info.startStr,
              end: info.endStr,
            };
            const data = {
              ...sampleEvent,
              username: username,
              fullname: details.FullName,
            };
            Axios.post("http://localhost:3001/addEvent", data).then((res) => {
              if (res.data.result) {
                return true;
              } else {
                throw new Error("Somthing went wrong !");
              }
            });
            // setEvents((prev) => [...prev, sampleEvent]);
          }
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Your Event has been saved",
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      }
    });
  };
  const EventClick = (info) => {
    var looper = [info.event.startStr, info.event.endStr];
    if (looper[0].length > 11) {
      looper = looper.map((time) => {
        const newTime = time.slice(0, -9).split("T").join(" ");
        console.log(newTime);
        return newTime;
      });
    }
    Swal.fire({
      title: info.event.title,
      text: `${looper[0]} - ${looper[1]}`,
      showCancelButton: true,
      confirmButtonText: "Delete !",
      confirmButtonColor: "#d33",
      cancelButtonText: "Ok",
      cancelButtonColor: "#7066e0",
      reverseButtons: true,
      didOpen: () => {
        Swal.getCancelButton().focus();
      },
      showLoaderOnConfirm: true,
      preConfirm: () => {
        try {
          const id = info.event.extendedProps._id;
          const data = {
            username: username,
            fullname: details.FullName,
          };
          Axios.delete(`http://localhost:3001/deleteEvent${id}`, {
            data: data,
          }).then((res) => {
            if (res.data.err) {
              throw new Error("Somthing went wrong !");
            } else {
              setEvents(events.filter((event) => events));
              return true;
            }
          });
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Event Deleted !",
          // showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      }
    });
  };

  return login ? (
    <>
      <Bars details={details} login={login} />
      <div className="authenticason">
        <div className="change">
          <div className="global-container calender-container">
            <FullCalender
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prevYear,prev,next,nextYear today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              dayMaxEventRows={3}
              fixedWeekCount={false}
              selectable={true}
              select={(e) => AddEvent(e)}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
              events={events}
              eventClick={(e) => EventClick(e)}
              height={"auto"}
            />
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <Bars details={details} login={login} />
      <div className="authenticason">
        <div>You need to login first</div>
      </div>
    </>
  );
}

export default Calendar;
