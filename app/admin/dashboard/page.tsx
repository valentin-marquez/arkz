import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QuickActionButton from "@/components/admin/QuickActionButton";

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase.rpc("is_admin", {
      user_id: user.id,
    });

    if (data === false || error) {
      redirect("/");
    }
  } else if (!user || error) {
    redirect("/");
  }

  return (
    <div>
      {/* Aquí se renderizan los componentes del Dashboard */}
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickActionButton label="Agregar nuevo Nikke" action="/admin/nikke" />
        <QuickActionButton
          label="Actualizar pisos de Tribe Towers"
          action="/admin/towers"
        />
        <QuickActionButton
          label="Agregar nueva versión del juego"
          action="/admin/version"
        />
        {/* Más botones para otras acciones rápidas */}
      </div>
    </div>
  );
}
