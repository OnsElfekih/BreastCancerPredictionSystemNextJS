"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../dashboard/DashboardLayout";

interface Rapport {
  _id: string;
  patienteNom: string;
  dateSaisie: string;
  url: string;
}

export default function RapportsPage() {
  const [user, setUser] = useState({ nom: "", prenom: "" });
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const nom = localStorage.getItem("nom") || "";
    const prenom = localStorage.getItem("prenom") || "";
    setUser({ nom, prenom });
    loadRapports();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const loadRapports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rapports", { headers: getAuthHeaders() });
      if (res.ok) setRapports(await res.json());
      else console.error("Erreur chargement rapports", await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const downloadPDF = async (url: string, id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Non connecté");

    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Erreur PDF" }));
      return alert(err.message);
    }

    const arrayBuffer = await res.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `rapport_${id}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded p-6 border border-pink-200">
        <h1 className="text-2xl font-bold text-pink-700 mb-4">Rapports Médicaux</h1>
        {loading ? <p>Chargement…</p> :
        rapports.length === 0 ? <p>Aucun rapport disponible.</p> :
        <table className="w-full border border-pink-200">
          <thead className="bg-pink-50">
            <tr>
              <th className="border px-4 py-2 text-pink-700">Patiente</th>
              <th className="border px-4 py-2 text-pink-700">Date</th>
              <th className="border px-4 py-2 text-pink-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {rapports.map((r) => (
              <tr key={r._id}>
                <td className="border px-4 py-2">{r.patienteNom}</td>
                <td className="border px-4 py-2">{new Date(r.dateSaisie).toLocaleDateString("fr-FR")}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => downloadPDF(r.url, r._id)} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
                    Télécharger PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </DashboardLayout>
  );
}
