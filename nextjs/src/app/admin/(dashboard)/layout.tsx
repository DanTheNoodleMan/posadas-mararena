// Archivo: src/app/admin/layout.tsx
// Layout principal del panel administrativo

import { createAdminClient } from "@/lib/auth-admin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
	title: "Panel Admin - Mararena Posadas",
	description: "Panel administrativo para gestión de reservas",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	// Obtener usuario (middleware ya verificó autenticación)
	const supabase = await createAdminClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Si no hay usuario aquí, el middleware fallará de todas formas
	if (!user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-neutral-50">
			{/* Sidebar */}
			<AdminSidebar user={user} />

			{/* Main Content */}
			<div className="lg:pl-64">
				{/* Header */}
				<AdminHeader user={user} />

				{/* Content Area */}
				<main className="p-4 md:p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
