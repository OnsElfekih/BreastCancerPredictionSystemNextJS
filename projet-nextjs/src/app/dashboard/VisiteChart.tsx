"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function VisitesChart() {
  const [data, setData] = useState([{ nouvelles: 0, recurrentes: 0 }]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/patientes/statistiques", {
      headers: { Authorization: token ? `Bearer ${token}` : "" }
    })
      .then(res => res.json())
      .then(stat => {
        setData([
          {
            nouvelles: stat.nouvellesVisites || 0,
            recurrentes: stat.visitesRecurrentes || 0
          }
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey={() => "Visites"} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="nouvelles" fill="#f472b6" name="Nouvelles" />
        <Bar dataKey="recurrentes" fill="#D9078F" name="Récurrentes" />
      </BarChart>
    </ResponsiveContainer>
  );
}
