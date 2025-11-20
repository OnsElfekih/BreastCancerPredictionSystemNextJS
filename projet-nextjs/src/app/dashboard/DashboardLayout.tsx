"use client";
import { ReactNode, useState, useEffect, useRef } from "react";
import Link from "next/link";

export const GridIcon = () => (
  <svg width="24" height="24" fill="currentColor">
    <rect x="3" y="3" width="8" height="8" />
    <rect x="13" y="3" width="8" height="8" />
    <rect x="3" y="13" width="8" height="8" />
    <rect x="13" y="13" width="8" height="8" />
  </svg>
);

export const UserCircleIcon = () => (
  <svg width="24" height="24" fill="currentColor">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 8-4 8-4s8 0 8 4H4z" />
  </svg>
);

export const PageIcon = () => (
  <svg width="24" height="24" fill="currentColor">
    <path d="M4 2h12l4 4v16H4V2z" />
  </svg>
);

export const TableIcon = () => (
  <svg width="24" height="24" fill="currentColor">
    <rect x="3" y="3" width="18" height="18" stroke="currentColor" fill="none" />
    <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" />
    <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" />
    <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" />
    <line x1="15" y1="3" x2="15" y2="21" stroke="currentColor" />
  </svg>
);

export const SignOutIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h3a2 2 0 002-2v-1m0-10V5a2 2 0 00-2-2h-3a2 2 0 00-2 2v1"
    />
  </svg>
);

interface LayoutProps {
  children: ReactNode;
  user: { nom: string; prenom: string };
}

export default function DashboardLayout({ children, user }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
    { icon: <UserCircleIcon />, name: "Patientes", path: "/patientes" },
    { icon: <TableIcon />, name: "Données Cliniques", path: "/donnees_cliniques" },
    { icon: <PageIcon />, name: "Rapports Médicaux", path: "/rapports" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 text-black">
      <div className={`bg-gray-900 text-white w-64 p-4 transition-all ${sidebarOpen ? "block" : "hidden"}`}>
        <h2 className="text-xl font-bold mb-6">Menu</h2>
        <ul>
          {navItems.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
            >
              {item.icon}
              <Link href={item.path}>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <button
            className="flex items-center justify-center w-10 h-10 text-black border rounded-lg hover:bg-gray-200"
            aria-label="Toggle Sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-black font-medium hover:text-gray-700 focus:outline-none"
            >
              Bonjour Dr {user.nom} {user.prenom}
              <span>{dropdownOpen ? "˄" : "˅"}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-black hover:bg-gray-100"
                >
                  <SignOutIcon />
                  <span>Déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>

      <div className="flex-1 p-6 bg-gray-100 overflow-hidden">
        {children}
      </div>
      </div>
    </div>
  );
}
