"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // installer heroicons: npm install @heroicons/react

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("gynécologue");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Login - Système de Prédiction du Cancer du Sein";
    const emailParam = searchParams.get("email") || "";
    const passwordParam = searchParams.get("password") || "";
    setEmail(emailParam);
    setPassword(passwordParam);
  }, [searchParams]);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Connexion réussie");
      localStorage.setItem("token", data.token);

      setTimeout(() => {
        if (data.role === "patiente") {
          window.location.href = "/dashboardPatiente";
        } else if (data.role === "gynécologue") {
          window.location.href = "/dashboard";
        }
      }, 1500);
    } else {
      setMessage(data.error || "Échec de la connexion");
    }
  } catch (error) {
    console.error(error);
    setMessage("Erreur serveur");
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg w-full max-w-md p-8"
      >
        <h1 className="text-2xl font-bold mb-8 text-center text-pink-400">
          Connexion
        </h1>

        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-gray-800 border border-gray-700 rounded p-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              className="w-full bg-gray-800 border border-gray-700 rounded p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400"
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
            className="w-full bg-gray-800 border border-gray-700 rounded p-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="gynécologue">Gynécologue</option>
            <option value="patiente">Patiente</option>
          </select>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded transition duration-200"
          >
            Se connecter
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 text-sm text-center ${
              message === "Connexion réussie" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-sm text-center text-gray-400">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-pink-400 hover:underline">
            S'inscrire
          </Link>
        </p>
      </form>
    </div>
  );
}
