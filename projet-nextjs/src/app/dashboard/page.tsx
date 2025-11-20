"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import VisitesChart from "./VisiteChart";

export default function Dashboard() {
  const [user, setUser] = useState({ nom: "", prenom: "" });
  const [totalPatientes, setTotalPatientes] = useState(0);

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
      .then(data => setTotalPatientes(Array.isArray(data) ? data.length : 0))
      .catch(() => setTotalPatientes(0));
  }, []);

  return (
    <DashboardLayout user={user}>
      <h1 className="text-2xl font-semibold mb-4 text-black">Tableau de bord</h1>
      <p className="text-black mb-6">
        Bienvenue dans votre espace de gestion des patientes et rapports médicaux.
      </p>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-pink-200 w-full max-w-sm mb-6">
        <h2 className="text-lg font-medium text-pink-700 mb-2">Total patientes</h2>
        <p className="text-3xl font-bold text-pink-900">{totalPatientes}</p>
      </div>
<div className="bg-white shadow-lg rounded-lg p-2 border mb-6 max-w-md">
  <h2 className="text-lg font-medium text-black mb-2 text-center">Statistiques des visites patientes</h2>
<div style={{ width: 400, height: 250 }}>  {/* largeur et hauteur fixes */}
  <VisitesChart />
</div>
</div>

    </DashboardLayout>
  );
}
