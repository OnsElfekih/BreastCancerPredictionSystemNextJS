"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState({ nom: "", prenom: "" });

  useEffect(() => {
    const nom = localStorage.getItem("nom") || "";
    const prenom = localStorage.getItem("prenom") || "";
    setUser({ nom, prenom });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-semibold">
        Bonjour Dr {user.nom} {user.prenom}
      </h1>
    </div>
  );
}
