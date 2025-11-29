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

  const downloadPDF = async (url: string, nom: string, prenom: string) => {
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
    a.download = `rapport_${nom}_${prenom}.pdf`; // Nom plus clair
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <DashboardLayout user={user}>
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-pink-200">
        <h1 className="text-3xl font-extrabold text-pink-700 mb-6 tracking-wide">Rapports Médicaux</h1>

        {loading ? (
          <p className="text-gray-500">Chargement…</p>
        ) : rapports.length === 0 ? (
          <p className="text-gray-600">Aucun rapport disponible.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-pink-50 text-pink-700 uppercase text-sm font-semibold">
                <tr>
                  <th className="px-6 py-3 border-b border-pink-200 text-left">Patiente</th>
                  <th className="px-6 py-3 border-b border-pink-200 text-left">Date</th>
                  <th className="px-6 py-3 border-b border-pink-200 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {rapports.map((r, idx) => (
                  <tr
                    key={r._id}
                    className={idx % 2 === 0 ? "bg-pink-50 hover:bg-pink-100" : "bg-white hover:bg-pink-100"}
                  >
                    <td className="px-6 py-4 border-b border-pink-200">{r.patienteNom}</td>
                    <td className="px-6 py-4 border-b border-pink-200">
                      {new Date(r.dateSaisie).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 border-b border-pink-200">
                      <button
                        onClick={() => downloadPDF(r.url, r.patienteNom.split(" ")[0], r.patienteNom.split(" ")[1] || "")}
                        className="bg-pink-600 text-white px-5 py-2 rounded-lg shadow hover:bg-pink-700 transition"
                      >
                        Télécharger PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
