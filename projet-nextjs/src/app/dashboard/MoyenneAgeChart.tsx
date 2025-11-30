"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  moyenneAge: number;
}

export default function MoyenneAgeChart({ moyenneAge }: Props) {
  const data = [{ name: "Moyenne âge", value: moyenneAge }];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#d63384" />
      </BarChart>
    </ResponsiveContainer>
  );
}
