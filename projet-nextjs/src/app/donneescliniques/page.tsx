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
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const openEditForm = (donnee: DonneesCliniques) => {
    setForm({
      age: donnee.age.toString(),
      BMI: donnee.BMI.toString(),
      glucose: donnee.glucose.toString(),
      insulin: donnee.insulin.toString(),
      HOMA: donnee.HOMA.toString(),
      leptin: donnee.leptin.toString(),
      adiponectin: donnee.adiponectin.toString(),
      resistin: donnee.resistin.toString(),
      MCP1: donnee.MCP1.toString(),
    });
    setEditingId(donnee._id || null);
    setShowForm(true);
  };

  const submitForm = async () => {
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

    if (editingId) {
      // PUT pour modification
      const res = await fetch(`/api/donneescliniques/${editingId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const updated = await res.json();
        setDonnees((prev) =>
          prev.map((d) => (d._id === editingId ? updated : d))
        );
      }
    } else {
      // POST pour ajout
      const res = await fetch(`/api/donneescliniques/${patienteId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setDonnees((prev) => [...prev, data]);
      }
    }

    // Reset form
    setShowForm(false);
    setEditingId(null);
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
                onClick={submitForm}
                className="bg-pink-600 text-white px-4 py-2 rounded"
              >
                {editingId ? "Modifier" : "Enregistrer"}
              </button>

              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
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
                <th className="border px-2 py-1">Actions</th>
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
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => openEditForm(d)}
                      className="bg-pink-500 text-white px-2 py-1 rounded"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
