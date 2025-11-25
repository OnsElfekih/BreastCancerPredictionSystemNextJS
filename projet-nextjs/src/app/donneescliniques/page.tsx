"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../dashboard/DashboardLayout";

interface DonneesCliniques {
  _id?: string;
  dateSaisie: string;
  age: number;
  BMI: number;
  glucose: number;
  insulin: number;
  HOMA: number;
  leptin: number;
  adiponectin: number;
  resistin: number;
  MCP1: number;
}

export default function DonneesCliniquesPage() {
  const [user, setUser] = useState({ nom: "", prenom: "" });

  const [patienteId, setPatienteId] = useState("");
  const [patiente, setPatiente] = useState<any>(null);

  const [donnees, setDonnees] = useState<DonneesCliniques[]>([]);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    age: "",
    BMI: "",
    glucose: "",
    insulin: "",
    HOMA: "",
    leptin: "",
    adiponectin: "",
    resistin: "",
    MCP1: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const nom = localStorage.getItem("nom") || "";
    const prenom = localStorage.getItem("prenom") || "";
    setUser({ nom, prenom });

    const params = new URLSearchParams(window.location.search);
    const idP = params.get("id");

    if (idP) {
      setPatienteId(idP);
      loadPatiente(idP);
      loadDonnees(idP);
    }
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const loadPatiente = async (id: string) => {
    try {
      const res = await fetch(`/api/patientes/${id}`, { headers: getAuthHeaders() });
      if (res.ok) setPatiente(await res.json());
    } catch {}
  };

  const loadDonnees = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/donneescliniques/${id}`, { headers: getAuthHeaders() });
      if (res.ok) setDonnees(await res.json());
    } catch {}
    setLoading(false);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const ajouterDonnee = async () => {
    const body = {
      age: parseFloat(form.age),
      BMI: parseFloat(form.BMI),
      glucose: parseFloat(form.glucose),
      insulin: parseFloat(form.insulin),
      HOMA: parseFloat(form.HOMA),
      leptin: parseFloat(form.leptin),
      adiponectin: parseFloat(form.adiponectin),
      resistin: parseFloat(form.resistin),
      MCP1: parseFloat(form.MCP1),
    };

    const res = await fetch(`/api/donneescliniques/${patienteId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      setDonnees((prev) => [...prev, data]);
      setShowForm(false);
      setForm({
        age: "",
        BMI: "",
        glucose: "",
        insulin: "",
        HOMA: "",
        leptin: "",
        adiponectin: "",
        resistin: "",
        MCP1: "",
      });
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded p-6 border border-pink-200">

        <h1 className="text-2xl font-bold text-pink-700 mb-4">
          Données cliniques
        </h1>

        {patiente && (
          <div className="bg-pink-50 p-4 rounded mb-4 border border-pink-200">
            <p className="text-lg font-medium">
              {patiente.userId?.nom} {patiente.userId?.prenom}
            </p>
            <p>ID Dossier: {patiente.idDossierMedical}</p>
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded mb-4"
          >
            Ajouter
          </button>
        )}

        {showForm && (
          <div className="bg-pink-50 p-4 rounded border border-pink-200 mb-4">

            {/* Champ date affiché dans le formulaire */}
            <div className="mb-3">
              <label className="block text-sm text-gray-700 mb-1">
                Date de saisie
              </label>
              <input
                type="text"
                value={new Date().toLocaleDateString()}
                readOnly
                className="border border-pink-300 px-3 py-2 rounded bg-gray-100 w-full"
              />
            </div>

            {/* Champs numériques */}
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(form).map((key) => (
                <input
                  key={key}
                  type="number"
                  step="0.01"
                  name={key}
                  placeholder={key}
                  value={(form as any)[key]}
                  onChange={handleChange}
                  className="border border-pink-300 px-3 py-2 rounded"
                />
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={ajouterDonnee}
                className="bg-pink-600 text-white px-4 py-2 rounded"
              >
                Enregistrer
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p>Chargement…</p>
        ) : (
          <table className="w-full border border-pink-200">
            <thead className="bg-pink-50">
              <tr>
                <th className="border px-2 py-1">Date</th>
                {Object.keys(form).map((key) => (
                  <th key={key} className="border px-2 py-1">{key}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {donnees.map((d) => (
                <tr key={d._id}>
                  <td className="border px-2 py-1">
                    {new Date(d.dateSaisie).toLocaleDateString()}
                  </td>

                  <td className="border px-2 py-1">{d.age}</td>
                  <td className="border px-2 py-1">{d.BMI}</td>
                  <td className="border px-2 py-1">{d.glucose}</td>
                  <td className="border px-2 py-1">{d.insulin}</td>
                  <td className="border px-2 py-1">{d.HOMA}</td>
                  <td className="border px-2 py-1">{d.leptin}</td>
                  <td className="border px-2 py-1">{d.adiponectin}</td>
                  <td className="border px-2 py-1">{d.resistin}</td>
                  <td className="border px-2 py-1">{d.MCP1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </DashboardLayout>
  );
}
