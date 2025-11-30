"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // npm install @heroicons/react
import Logo from "../logo.png";
import Image from "next/image";
export default function RegisterPage() {
  useEffect(() => {
    document.title = "Inscription - Système de Prédiction du Cancer du Sein";
  }, []);

  const router = useRouter();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("gynécologue");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // état pour l’œil

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, prenom, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Inscription réussie");
        setTimeout(() => {
          router.push(
            `/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`
          );
        }, 3000);
      } else {
        setMessage(data.error || "Échec de l'inscription");
      }
    } catch (error) {
      console.error(error);
      setMessage("Une erreur est survenue");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <form
        onSubmit={handleRegister}
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg w-full max-w-md p-8"
      >
      <div className="flex justify-center mb-4">
        <Image
          src={Logo}
          alt="Logo du système"
          className="object-contain"
          width={64} // h-16
          height={64} // w-16
        />
      </div>
        <h1 className="text-2xl font-semibold text-center mb-6 text-pink-400">
          Créer un compte
        </h1>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nom"
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Prénom"
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Champ mot de passe avec icône Eye */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <select
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="gynécologue">Gynécologue</option>
            <option value="patiente">Patiente</option>
          </select>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded transition duration-200"
          >
            S'inscrire
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message === "Inscription réussie" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-sm text-center text-gray-400">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-pink-400 hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}
