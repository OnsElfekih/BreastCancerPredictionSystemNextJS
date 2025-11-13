"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";

export default function Dashboard() {
  const [user, setUser] = useState({ nom: "", prenom: "" });
  const [totalPatientes, setTotalPatientes] = useState(0);

  useEffect(() => {
    const nom = localStorage.getItem("nom") || "";
    const prenom = localStorage.getItem("prenom") || "";
    setUser({ nom, prenom });

    fetch("/api/patientes")
      .then(res => res.json())
      .then(data => setTotalPatientes(data.length))
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
    </DashboardLayout>
  );
}
