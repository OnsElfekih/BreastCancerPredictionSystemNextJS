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
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    idDossierMedical: "",
    dateDeNaissance: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

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
        setPatientes([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPatientes(Array.isArray(data) ? data : []);
    } catch {
      setPatientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/patientes/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPatientes((prev) => prev.filter((p) => p._id !== deleteId));
      }
    } catch {}

    setShowDelete(false);
    setDeleteId(null);
  };

  const handleAddClick = () => {
    setErrorMessage("");
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      password: "",
      idDossierMedical: "",
      dateDeNaissance: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditClick = (p: PatienteData) => {
    setFormData({
      nom: p.userId?.nom || "",
      prenom: p.userId?.prenom || "",
      email: p.userId?.email || "",
      password: "",
      idDossierMedical: p.idDossierMedical, // affiché en lecture seule
      dateDeNaissance: p.dateDeNaissance
        ? new Date(p.dateDeNaissance).toISOString().split("T")[0]
        : "",
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage("");

  if (formData.dateDeNaissance) {
    const selectedDate = new Date(formData.dateDeNaissance);
    if (selectedDate > new Date()) {
      setErrorMessage("La date de naissance ne peut pas être dans le futur");
      return;
    }
  }

  try {
    const url = editingId ? `/api/patientes/${editingId}` : "/api/patientes";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      if (editingId) {
        setPatientes((prev) =>
          prev.map((p) => (p._id === editingId ? data.patiente : p))
        );
      } else {
        setPatientes((prev) => [...prev, data.patiente]);
      }

      setFormData({ nom: "", prenom: "", email: "", password: "", idDossierMedical: "", dateDeNaissance: "" });
      setShowForm(false);
      setEditingId(null);
    } else {
      setErrorMessage(data.message || "Erreur lors de l'opération");
    }
  } catch {
    setErrorMessage("Erreur réseau");
  }
};


  const filteredPatientes = patientes.filter(
    (p) =>
      (p.userId?.nom || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.userId?.prenom || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.idDossierMedical || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout user={user}>
      <div className={showForm || showDelete ? "blur-sm pointer-events-none" : ""}>
        {/* Total patientes */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-pink-200 w-full max-w-sm mb-6">
          <h2 className="text-lg font-medium text-pink-700 mb-2">Total patientes</h2>
          <p className="text-3xl font-bold text-pink-900">{patientes.length}</p>
        </div>

        {/* Recherche + Ajouter */}
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

        {/* Tableau */}
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
                    {p.dateDeNaissance
                      ? new Date(p.dateDeNaissance).toLocaleDateString("fr-FR")
                      : "-"}
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="bg-pink-400 text-white px-2 py-1 rounded hover:bg-pink-500 flex-1"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(p._id);
                        setShowDelete(true);
                      }}
                      className="bg-rose-500 text-white px-2 py-1 rounded hover:bg-rose-600 flex-1"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ----------- MODAL AJOUT / MODIF ------------ */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative bg-white shadow-md rounded-lg p-6 border border-pink-200 w-full max-w-3xl z-50">
            <h3 className="text-xl font-semibold text-pink-700 mb-4">
              {editingId ? "Modifier patiente" : "Ajouter une nouvelle patiente"}
            </h3>

            {errorMessage && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-2">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={handleFormChange}
                  className="px-3 py-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
                />
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={handleFormChange}
                  className="px-3 py-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="px-3 py-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
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
                    className="px-3 py-2 border border-pink-300 rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-gray-600"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5"/> : <EyeIcon className="w-5" />}
                  </button>
                </div>

<input
  type="text"
  name="idDossierMedical"
  value={formData.idDossierMedical}
  readOnly={!!editingId} // lecture seule uniquement en modification
  placeholder="ID Dossier Medical"
  onChange={handleFormChange} // obligatoire pour saisir
  required={!editingId} // champ obligatoire seulement en ajout
  className={`px-3 py-2 border rounded w-full ${
    editingId ? "bg-gray-100" : "bg-white"
  } border-pink-300`}
/>

              </div>

              <label className="flex flex-col text-pink-700">
                Date de naissance
                <input
                  type="date"
                  name="dateDeNaissance"
                  value={formData.dateDeNaissance}
                  onChange={handleFormChange}
                  className="mt-1 px-3 py-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
                />
              </label>

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

      {/* ----------- MODAL SUPPRESSION ------------ */}
      {showDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative bg-white shadow-lg rounded-lg p-6 border border-pink-300 w-full max-w-md z-50">
            <h3 className="text-lg font-semibold text-pink-700 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-700 mb-6">
              Voulez-vous vraiment supprimer cette patiente ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
