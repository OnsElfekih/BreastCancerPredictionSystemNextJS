"use client";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import DashboardLayout from "../dashboard/DashboardLayout";

interface PatienteData {
  _id: string;
  idDossierMedical: string;
  dateDeNaissance: string;
  userId?: {
    nom?: string;
    prenom?: string;
    email?: string;
  } | null;
}

export default function PatientesPage() {
  const [user, setUser] = useState({ nom: "", prenom: "" });
  const [patientes, setPatientes] = useState<PatienteData[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    idDossierMedical: "",
    dateDeNaissance: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const nom = localStorage.getItem("nom") || "";
    const prenom = localStorage.getItem("prenom") || "";
    setUser({ nom, prenom });
    loadPatientes();
  }, []);

  const loadPatientes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/patientes");
      if (!res.ok) {
        console.error("fetch /api/patientes status", res.status);
        setPatientes([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPatientes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur fetch patientes:", err);
      setPatientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette patiente ?")) return;
    try {
      const res = await fetch(`/api/patientes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPatientes(prev => prev.filter(p => p._id !== id));
      } else {
        console.error("Erreur suppression", await res.text());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClick = () => setShowForm(true);
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/patientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setPatientes(prev => [...prev, data.patiente]);
        setFormData({
          nom: "",
          prenom: "",
          email: "",
          password: "",
          idDossierMedical: "",
          dateDeNaissance: "",
        });
        setShowForm(false);
      } else {
        alert(data.message || "Erreur lors de l'ajout");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de l'ajout");
    }
  };

  const filteredPatientes = patientes.filter(p =>
    (p.userId?.nom || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.userId?.prenom || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.idDossierMedical || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout user={user}>
      <div className="bg-white shadow-lg rounded-lg p-6 border border-pink-200 w-full max-w-sm mb-6">
        <h2 className="text-lg font-medium text-pink-700 mb-2">Total patientes</h2>
        <p className="text-3xl font-bold text-pink-900">{patientes.length}</p>
      </div>

      <div className="flex items-center mb-4 max-w-5xl">
        <input
          type="text"
          placeholder="Rechercher par Nom, Prénom ou ID Dossier"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-pink-300 rounded flex-grow mr-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          onClick={handleAddClick}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-44"
        >
          Ajouter patiente
        </button>
      </div>

      {showForm && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white shadow-md rounded-lg p-6 border border-pink-200">
            <h3 className="text-xl font-semibold text-pink-700 mb-4">
              Ajouter une nouvelle patiente
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={handleFormChange}
                  className="px-3 py-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
                  required
                />
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={handleFormChange}
                  className="px-3 py-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="px-3 py-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="px-3 py-2 border border-pink-300 rounded w-full focus:ring-2 focus:ring-pink-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-pink-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <input
                  type="text"
                  name="idDossierMedical"
                  placeholder="ID Dossier médical"
                  value={formData.idDossierMedical}
                  onChange={handleFormChange}
                  className="px-3 py-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <label className="flex-1 flex flex-col text-pink-700">
                  Date de naissance
                  <input
                    type="date"
                    name="dateDeNaissance"
                    value={formData.dateDeNaissance}
                    onChange={handleFormChange}
                    className="mt-1 px-3 py-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
                    required
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full border border-pink-200 bg-white rounded">
          <thead className="bg-pink-50">
            <tr>
              <th className="border px-4 py-2 text-pink-700">Nom</th>
              <th className="border px-4 py-2 text-pink-700">Prénom</th>
              <th className="border px-4 py-2 text-pink-700">Email</th>
              <th className="border px-4 py-2 text-pink-700">ID Dossier</th>
              <th className="border px-4 py-2 text-pink-700">Date</th>
              <th className="border px-4 py-2 text-pink-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatientes.map((p) => (
              <tr key={p._id}>
                <td className="border px-4 py-2">{p.userId?.nom || "-"}</td>
                <td className="border px-4 py-2">{p.userId?.prenom || "-"}</td>
                <td className="border px-4 py-2">{p.userId?.email || "-"}</td>
                <td className="border px-4 py-2">{p.idDossierMedical}</td>
                <td className="border px-4 py-2">
                  {p.dateDeNaissance ? new Date(p.dateDeNaissance).toLocaleDateString("fr-FR") : "-"}
                </td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    onClick={() => console.log("Modifier", p._id)}
                    className="bg-pink-400 text-white px-2 py-1 rounded hover:bg-pink-500 flex-1 text-center"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-rose-500 text-white px-2 py-1 rounded hover:bg-rose-600 flex-1 text-center"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
}
