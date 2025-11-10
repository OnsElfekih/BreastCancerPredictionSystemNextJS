"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email") || "";
    const passwordParam = searchParams.get("password") || "";
    setEmail(emailParam);
    setPassword(passwordParam);
  }, [searchParams]);

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="p-6 border rounded w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-2"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
          Se connecter
        </button>
      </form>
    </div>
  );
}
