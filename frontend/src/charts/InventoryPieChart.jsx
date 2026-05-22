import { Doughnut } from "react-chartjs-2";

import "./chartSetup.js";
import { chartTextColor } from "./chartSetup.js";

const InventoryPieChart = ({ inventory }) => {
  const values = [
    inventory?.healthyStock || 0,
    inventory?.lowStock || 0,
    inventory?.outOfStock || 0
  ];

  const chartData = {
    labels: ["Healthy", "Low stock", "Out of stock"],
    datasets: [
      {
        data: values,
        backgroundColor: ["#22c55e", "#f59e0b", "#fb7185"],
        borderColor: "#0f172a",
        borderWidth: 4,
        hoverOffset: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "64%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: chartTextColor, boxWidth: 10, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: "#020617",
        borderColor: "#1e293b",
        borderWidth: 1
      }
    }
  };

  return <Doughnut data={chartData} options={options} />;
};

export default InventoryPieChart;
