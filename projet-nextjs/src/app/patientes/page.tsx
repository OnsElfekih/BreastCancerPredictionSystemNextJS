"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../dashboard/DashboardLayout";

interface PatienteData {
  _id: string;
  idDossierMedical: string;
  dateDeNaissance: string;
  userId: {
    nom: string;
    prenom: string;
    email: string;
  };
}

export default function PatientesPage() {
  const [user, setUser] = useState({ nom: "", prenom: "" });
  const [patientes, setPatientes] = useState<PatienteData[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
  nom: "",
  prenom: "",
  email: "",
  password: "",
  idDossierMedical: "",
  dateDeNaissance: "",
});

  useEffect(() => {
    const nom = localStorage.getItem("nom") || "";
    const prenom = localStorage.getItem("prenom") || "";
    setUser({ nom, prenom });

    fetch("/api/patientes")
      .then((res) => res.json())
      .then((data) => setPatientes(data))
      .catch((err) => console.error(err));
  }, []);

  const handleEdit = (id: string) => {
    console.log("Modifier patiente", id);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/patientes/${id}`, { method: "DELETE" });
      setPatientes(patientes.filter(p => p._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  const handleAddClick = () => setShowForm(true);
const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch("/api/patientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setPatientes([...patientes, data.patiente]);
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
  } catch (error) {
    console.error(error);
  }
};


const filteredPatientes = patientes.filter(p =>
  p.userId?.nom?.toLowerCase().includes(search.toLowerCase()) ||
  p.userId?.prenom?.toLowerCase().includes(search.toLowerCase()) ||
  p.idDossierMedical.toLowerCase().includes(search.toLowerCase())
);

  return (
    <DashboardLayout user={user}>
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 w-full max-w-sm mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Total patientes</h2>
        <p className="text-3xl font-bold text-gray-900">{patientes.length}</p>
      </div>

      <div className="flex items-center mb-4 max-w-5xl">
        <input
          type="text"
          placeholder="Rechercher par Nom, Prénom ou ID Dossier"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded flex-grow mr-2"
        />
        <button
          onClick={handleAddClick}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-44"
        >
          Ajouter patiente
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="mb-4 p-4 bg-gray-100 rounded max-w-5xl"
        >
          <div className="flex gap-4 mb-2">
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleFormChange}
              className="px-2 py-1 border rounded flex-1"
              required
            />
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleFormChange}
              className="px-2 py-1 border rounded flex-1"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              className="px-2 py-1 border rounded flex-1"
              required
            />
          </div>
          <div className="flex gap-4 mb-2">
            <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleFormChange}
                className="px-2 py-1 border rounded flex-1"
                required
            />
            </div>
          <div className="flex gap-4 mb-2">
            <input
              type="text"
              name="idDossierMedical"
              placeholder="ID Dossier médical"
              value={formData.idDossierMedical}
              onChange={handleFormChange}
              className="px-2 py-1 border rounded flex-1"
              required
            />
            <input
              type="date"
              name="dateDeNaissance"
              placeholder="Date de naissance"
              value={formData.dateDeNaissance}
              onChange={handleFormChange}
              className="px-2 py-1 border rounded flex-1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Enregistrer
          </button>
        </form>
      )}

      <table className="w-full border border-gray-300 bg-white rounded">
        <thead>
          <tr>
            <th className="border px-4 py-2 w-32">Nom</th>
            <th className="border px-4 py-2 w-32">Prénom</th>
            <th className="border px-4 py-2 w-80">Email</th>
            <th className="border px-4 py-2 w-32">ID Dossier</th>
            <th className="border px-4 py-2 w-24">Date de naissance</th>
            <th className="border px-4 py-2 w-40">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatientes.map((p) => (
            <tr key={p._id}>
              <td className="border px-4 py-2 w-32">{p.userId.nom}</td>
              <td className="border px-4 py-2 w-32">{p.userId.prenom}</td>
              <td className="border px-4 py-2 w-80">{p.userId.email}</td>
              <td className="border px-4 py-2 w-32">{p.idDossierMedical}</td>
              <td className="border px-4 py-2 w-24">{p.dateDeNaissance}</td>
              <td className="border px-4 py-2 w-40 flex gap-2">
                <button
                  onClick={() => handleEdit(p._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
