"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";

export default function Dashboard() {
  const [user, setUser] = useState({ nom: "", prenom: "" });

  useEffect(() => {
    const nom = localStorage.getItem("nom") || "";
    const prenom = localStorage.getItem("prenom") || "";
    setUser({ nom, prenom });
  }, []);

  return (
    <DashboardLayout user={user}>
      <h1 className="text-2xl font-semibold mb-4 text-black !important">
        Tableau de bord
      </h1>
      <p className="text-black !important">
        Bienvenue dans votre espace de gestion des patientes et rapports médicaux.
      </p>
    </DashboardLayout>
  );
}
