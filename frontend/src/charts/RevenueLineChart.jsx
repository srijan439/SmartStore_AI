import { Line } from "react-chartjs-2";

import "./chartSetup.js";
import { chartGridColor, chartTextColor } from "./chartSetup.js";

const RevenueLineChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map((point) => point.month),
    datasets: [
      {
        label: "Revenue",
        data: data.map((point) => point.revenue),
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34, 211, 238, 0.16)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: "Inventory Units",
        data: data.map((point) => point.inventoryUnits || 0),
        borderColor: "#fb7185",
        backgroundColor: "rgba(251, 113, 133, 0.08)",
        tension: 0.4,
        fill: false,
        pointRadius: 3
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
      x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } },
      y: { ticks: { color: chartTextColor }, grid: { color: chartGridColor }, beginAtZero: true }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default RevenueLineChart;
