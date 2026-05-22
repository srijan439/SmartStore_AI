import { Bar } from "react-chartjs-2";

import "./chartSetup.js";
import { chartGridColor, chartTextColor } from "./chartSetup.js";

const ProductBarChart = ({ products = [] }) => {
  const chartData = {
    labels: products.map((product) => product.name),
    datasets: [
      {
        label: "Revenue",
        data: products.map((product) => product.revenue),
        backgroundColor: "rgba(34, 211, 238, 0.78)",
        borderRadius: 8
      },
      {
        label: "Stock",
        data: products.map((product) => product.stock),
        backgroundColor: "rgba(20, 184, 166, 0.62)",
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: chartTextColor, boxWidth: 10, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: "#020617",
        borderColor: "#1e293b",
        borderWidth: 1
      }
    },
    scales: {
      x: { ticks: { color: chartTextColor, maxRotation: 0, autoSkip: true }, grid: { display: false } },
      y: { ticks: { color: chartTextColor }, grid: { color: chartGridColor }, beginAtZero: true }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default ProductBarChart;
