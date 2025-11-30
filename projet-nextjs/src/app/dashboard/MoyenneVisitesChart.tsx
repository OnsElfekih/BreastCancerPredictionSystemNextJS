"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  moyenneVisites: number;
}

export default function MoyenneVisitesChart({ moyenneVisites }: Props) {
  const data = [{ name: "Moyenne visites", value: moyenneVisites }];

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
