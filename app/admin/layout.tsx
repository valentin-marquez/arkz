import { ReactNode } from "react";
import Sidebar from "@/components/admin/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-card-background/60">{children}</main>
    </div>
  );
}
