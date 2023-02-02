import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale, Scale } from "chart.js";

const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false,
      // position: "right",
      // reverse: true,
      // rtl: true,  //or   // textDirection: "rtl",
    },
    /* subtitle: {
      display: true,
      text: "Custom Chart Subtitle",
    }, */
  },
  scales: {
    x: {
      // grid: {
      // color: "red",
      // borderColor: "green",
      // tickColor: "black",
      // },
      ticks: {
        display: true,
        autoSkip: true,
        maxTicksLimit: 4,
        maxRotation: 0,
        minRotation: 0,
      },
      // title: {
      //   display: true,
      //   text: "2022",
      //   // font: {
      //   //   size: "20px",
      //   // },
      // },
    },
    y: {
      grid: {
        display: false,
        // color: "blue",
        // borderColor: "pink",
        // tickColor: "yellow",
      },
      //     ticks: {
      //       color: "pink",
      //       min: 0,
      //     },
      beginAtZero: true,
      //     title: {
      //       display: true,
      //       text: "Amount",
      //       color: "red",
      //       font: {
      //         size: "20px",
      //       },
      //     },
    },
  },
};

function LineChart({ color, yearData }) {
  const chartRef = useRef();
  const [ogRef, setRef] = useState();

  useEffect(() => {
    const gradient = chartRef.current.ctx.createLinearGradient(0, -100, 0, 230);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "transparent");
    setRef(gradient);
  }, [chartRef]);

  const dataArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // console.log(yearData);
  if (Object.keys(yearData).length !== 0) {
    yearData.map((obj) => {
      dataArray[new Date(obj.time).getMonth()] += obj.amount;
    });
  }
  // console.log(dataArray);

  const data = {
    labels: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ],
    datasets: [
      {
        data: dataArray,
        backgroundColor: ogRef, // Bar
        borderColor: color, // Line
        borderWidth: 2,
        pointRadius: 2,
        pointBackgroundColor: color,
        // hoverOffset: 1,
        tension: 0.4,
        fill: true,
      },
      // {
      //   label: "Expenses",
      //   data: ["2190", "14190", "10302", "16032"],
      //   backgroundColor: "#36A2EB", // Bar
      //   borderColor: "#36A2EB", // Line
      //   hoverOffset: 5,
      //   tension: 0.4,
      // },
    ],
  };

  return <Line ref={chartRef} data={data} options={options} />;
}

export default LineChart;
