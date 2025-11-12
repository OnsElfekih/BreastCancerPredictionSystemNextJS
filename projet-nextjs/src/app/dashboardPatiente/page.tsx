"use client";
import { useEffect, useState } from "react";
import DashboardLayoutPatiente from "./DashboardLayoutPatiente";

export default function DashboardPatiente() {
  const [user, setUser] = useState({ nom: "", prenom: "" });

  useEffect(() => {
    const nom = localStorage.getItem("nom") || "";
    const prenom = localStorage.getItem("prenom") || "";
    setUser({ nom, prenom });
  }, []);

  return (
    <DashboardLayoutPatiente user={user}>
      <p>Bienvenue dans votre espace. Vous pouvez consulter ou télécharger vos rapports.</p>
    </DashboardLayoutPatiente>
  );
}
