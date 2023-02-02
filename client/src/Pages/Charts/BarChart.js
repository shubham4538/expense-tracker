import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale, Scale } from "chart.js";

const options = {
  maintainAspectRatio: false,
  responsive: true,
  backgroundColor: "#FF63843a", // Bar
  borderWidth: 2,
  borderColor: "#FF6384",
  plugins: {
    legend: {
      display: false,
      // position: "right",
      // reverse: true,
      // rtl: true,  //or   // textDirection: "rtl",
      // labels: {
      //   // textAlign: "center",
      // },
    },
    /* subtitle: {
      display: true,
      text: "Custom Chart Subtitle",
    }, */
  },
  scales: {
    x: {
      ticks: {
        display: true,
        autoSkip: true,
        maxTicksLimit: 4,
        maxRotation: 0,
        minRotation: 0,
      },
    },
    y: {
      grid: {
        display: false,
      },
      beginAtZero: true,
    },
  },
};

function BarChart({ yearData }) {
  const dataArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (Object.keys(yearData).length !== 0) {
    yearData.map((obj) => {
      dataArray[new Date(obj.time).getMonth()] += obj.amount;
    });
  }

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
        // hoverOffset: 1,
        tension: 0.4,
        fill: true,
        startsWithZero: true,
      },
      // {
      //   label: "Expenses",
      //   data: ["2190", "14190", "10302", "16032"],
      //   backgroundColor: "#36A2EB", // Bar
      //   borderColor: "#36A2EB", // Line
      //   startsWithZero: true,
      //   hoverOffset: 5,
      //   tension: 0.4,
      // },
    ],
  };

  return <Bar data={data} options={options} />;
}

export default BarChart;
