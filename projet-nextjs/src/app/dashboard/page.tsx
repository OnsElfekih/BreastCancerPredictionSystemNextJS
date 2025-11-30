"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import VisitesChart from "./VisiteChart";
import MoyenneAgeChart from "./MoyenneAgeChart";
import MoyenneVisitesChart from "./MoyenneVisitesChart";

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
        setMoyenneAge(ages.length ? Math.round(ages.reduce((a,b) => a+b, 0)/ages.length) : 0);

        const visites = data.map(p => p.visites || 0);
        setMoyenneVisites(visites.length ? Math.round(visites.reduce((a,b)=>a+b,0)/visites.length) : 0);
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
  <h1 className="text-3xl font-bold mb-6 text-black">Tableau de bord</h1>
  <p className="text-black mb-8 text-lg">
    Bienvenue dans votre espace de gestion des patientes et rapports médicaux.
  </p>

  <div className="flex gap-8">
    {/* Colonne gauche : Total patientes + VisitesChart */}
    <div className="flex flex-col gap-6">
      <div className="bg-white shadow-xl rounded-xl p-8 border border-pink-200 w-72">
        <h2 className="text-xl font-semibold text-pink-700 mb-3">Total patientes</h2>
        <p className="text-4xl font-bold text-pink-900">{totalPatientes}</p>
      </div>

      <div className="bg-white shadow-xl rounded-xl p-4 border">
        <h2 className="text-xl font-semibold text-black mb-3 text-center">
          Statistiques des visites patientes
        </h2>
        <div style={{ width: 450, height: 300 }}>
          <VisitesChart />
        </div>
      </div>
    </div>

    {/* Ligne droite : MoyenneAgeChart et MoyenneVisitesChart côte à côte */}
    <div className="flex gap-6">
      <div className="bg-white shadow-xl rounded-xl p-6 border w-72 h-full flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-black mb-3 text-center">Moyenne d'âge</h2>
        <div style={{ width: 200, height: 200 }}>
          <MoyenneAgeChart moyenneAge={moyenneAge} />
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-xl p-6 border w-72 h-full flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-black mb-3 text-center">Moyenne de visites</h2>
        <div style={{ width: 200, height: 200 }}>
          <MoyenneVisitesChart moyenneVisites={moyenneVisites} />
        </div>
      </div>
    </div>
  </div>
</DashboardLayout>



  );
}
