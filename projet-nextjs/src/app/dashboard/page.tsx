"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import VisitesChart from "./VisiteChart";
import AgePieChart from './AgePieChart'; // chemin correct vers AgePieChart

interface PatienteData {
  visites?: number;
  dateDeNaissance?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState({ nom: "", prenom: "" });
  const [totalPatientes, setTotalPatientes] = useState(0);
  const [moyenneAge, setMoyenneAge] = useState(0);
  const [moyenneVisites, setMoyenneVisites] = useState(0);
  const [patientes, setPatientes] = useState<PatienteData[]>([]);

  useEffect(() => {
    const nom = localStorage.getItem("nom") || "";
    const prenom = localStorage.getItem("prenom") || "";
    setUser({ nom, prenom });

    const token = localStorage.getItem("token");

    fetch("/api/patientes", {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(res => res.json())
      .then((data: PatienteData[]) => {
        if (!Array.isArray(data)) data = [];
        setPatientes(data);
        setTotalPatientes(data.length);

        const ages = data
          .map(p => p.dateDeNaissance ? new Date().getFullYear() - new Date(p.dateDeNaissance).getFullYear() : 0)
          .filter(age => age > 0);
        setMoyenneAge(ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0);

        const visites = data.map(p => p.visites || 0);
        setMoyenneVisites(visites.length ? Math.round(visites.reduce((a, b) => a + b, 0) / visites.length) : 0);
      })
      .catch(() => {
        setPatientes([]);
        setTotalPatientes(0);
        setMoyenneAge(0);
        setMoyenneVisites(0);
      });
  }, []);

  return (
    <DashboardLayout user={user}>
      <div className="grid grid-cols-3 gap-4">

        <div className="bg-white shadow rounded-lg p-4 border border-pink-200 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-pink-700 mb-2">Total patientes</h2>
          <p className="text-3xl font-bold text-pink-900">{totalPatientes}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border border-pink-200 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-pink-700 mb-2">Moyenne âge</h2>
          <p className="text-3xl font-bold text-pink-900">{moyenneAge} ans</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border border-pink-200 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-pink-700 mb-2">Moyenne visites</h2>
          <p className="text-3xl font-bold text-pink-900">{moyenneVisites}</p>
        </div>

        <div className="col-span-3 grid grid-cols-2 gap-4">

          <div className="bg-white shadow rounded-lg p-4 border">
            <h2 className="text-lg font-semibold text-black mb-4 text-center">Statistiques des visites patientes</h2>
            <div className="w-full h-64">
              <VisitesChart />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4 border">
            <h2 className="text-lg font-semibold text-black mb-4 text-center">Répartition par génération</h2>
            <div className="w-full h-64">
              <AgePieChart patientes={patientes} />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
