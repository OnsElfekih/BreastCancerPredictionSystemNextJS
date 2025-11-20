"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function VisitesChart() {
  const [data, setData] = useState({ nouvellesVisites: 0, visitesRecurrentes: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/patientes/statistiques", {
      headers: { Authorization: token ? `Bearer ${token}` : "" }
    })
      .then(res => res.json())
      .then(stat => setData(stat))
      .catch(() => {});
  }, []);

  const chartData = {
    labels: ["Visites"],
    datasets: [
      { label: "Nouvelles", data: [data.nouvellesVisites], backgroundColor: "#f472b6" },
      { label: "Récurrentes", data: [data.visitesRecurrentes], backgroundColor: "#3b82f6" }
    ]
  };

  return <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />;
}
