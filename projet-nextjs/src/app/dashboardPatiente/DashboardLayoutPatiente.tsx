"use client";
import { LogOut, FileText } from "lucide-react";

export default function DashboardLayoutPatiente({ user, children }: any) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-lg font-semibold">
          Bonjour {user.nom} {user.prenom}
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="flex items-center space-x-1 text-pink-400 hover:text-pink-300"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
