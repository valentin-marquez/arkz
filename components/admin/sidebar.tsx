"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Users, Settings } from "lucide-react"; // Importa los iconos de lucide-react

export default function Sidebar() {
  return (
    <aside className="w-64 bg-background shadow-md h-screen border rounded flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
        <nav className="mt-4">
          <ul>
            <li className="mb-2">
              <Link href="/admin/dashboard">
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center"
                >
                  <Home className="h-5 w-5 mr-4 flex-shrink-0" />
                  <span className="flex-grow">Dashboard</span>
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/users">
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center"
                >
                  <Users className="h-5 w-5 mr-4 flex-shrink-0" />
                  <span className="flex-grow">Users</span>
                </Button>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/settings">
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center"
                >
                  <Settings className="h-5 w-5 mr-4 flex-shrink-0" />
                  <span className="flex-grow">Settings</span>
                </Button>
              </Link>
            </li>
            {/* Más enlaces a otras secciones de administración */}
          </ul>
        </nav>
      </div>
      <div className="p-4 border-t">
        <p className="text-sm text-gray-600">© 2023 Admin Panel</p>
      </div>
    </aside>
  );
}
