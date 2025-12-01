"use client";
import { useEffect, useState } from "react";
import DashboardLayoutPatiente from "./DashboardLayoutPatiente";

export default function DashboardPatiente() {
  const [user, setUser] = useState({ nom: "", prenom: "" });
  const [rapports, setRapports] = useState<any[]>([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // Charger le nom/prénom depuis localStorage si disponible
  const loadUser = () => {
    const nom = localStorage.getItem("nom") || "";
    const prenom = localStorage.getItem("prenom") || "";
    setUser({ nom, prenom });
  };

  const loadRapports = async () => {
    const res = await fetch("/api/patientes/mes-rapports", { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      setRapports(data);
    }
  };

  useEffect(() => {
    loadUser();
    loadRapports();
  }, []);

  const downloadPDF = async (url: string) => {
    const res = await fetch(url, { headers: getAuthHeaders() });
    const arrayBuffer = await res.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `rapport.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <DashboardLayoutPatiente user={user}>
      {rapports.length === 0 ? (
        <p>Aucun rapport disponible.</p>
      ) : (
        <ul>
          {rapports.map((r) => (
<li
  key={r._id}
  className="mb-4 flex justify-between items-center bg-gray-800 p-4 rounded shadow"
>
  <span className="text-lg font-medium">
    {new Date(r.dateSaisie).toLocaleDateString("fr-FR")}
  </span>

  <button
    onClick={() => downloadPDF(r.url)}
    className="text-white bg-[#D90479] px-4 py-2 rounded font-medium hover:bg-[#c1036d] transition"
  >
    Télécharger PDF
  </button>
</li>

          ))}
        </ul>
      )}
    </DashboardLayoutPatiente>
  );
}
