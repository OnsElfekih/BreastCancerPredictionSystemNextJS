"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  moyenneAge: number;
}

export default function MoyenneAgeChart({ moyenneAge }: Props) {
  const data = [{ name: "Âge", value: moyenneAge }];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#D90479" />
      </BarChart>
    </ResponsiveContainer>
  );
}
