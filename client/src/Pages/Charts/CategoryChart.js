import React from "react";
import { Bar } from "react-chartjs-2";

const options = {
  maintainAspectRatio: false,
  responsive: true,
  borderWidth: 2,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        display: true,
        autoSkip: true,
        maxTicksLimit: 12,
        minRotation: 45,
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

const expenseLabels = [
  "House",
  "Travelling",
  "Food",
  "Utilities",
  "Insurance",
  "Health",
  "Investment",
  "Personal",
  "Entertainment",
  "Turf",
  "Gift",
  "Miscellaneous",
];
const incomeLabels = [
  "Salary",
  "Incentive",
  "Business",
  "Property",
  "Utilities",
  "Insurance",
  "Investment",
  "Gift",
  "Miscellaneous",
];

function CategoryChart({ yearData, type, color }) {
  const categoryList = {};

  yearData.map((item) => {
    if (categoryList[item.category]) {
      categoryList[item.category] += item.amount;
    } else {
      categoryList[item.category] = item.amount;
    }
  });

  const labels = type == "income" ? incomeLabels : expenseLabels;
  const finalList = labels.map((label) => {
    if (categoryList[label]) {
      return { category: label, amount: categoryList[label] };
    } else {
      return { category: label, amount: 0 };
    }
  });

  const sortedList = finalList.sort((a, b) => b.amount - a.amount);

  const data = {
    labels: sortedList.map((label) => label.category),
    datasets: [
      {
        data: sortedList.map((label) => label.amount),
        backgroundColor: color.background,
        borderColor: color.foreground,
      },
    ],
  };

  return <Bar data={data} options={options} />;
}

export default CategoryChart;
