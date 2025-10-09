"use client";

// Archivo: src/components/admin/AdminHeader.tsx
// Header del panel admin con logout

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSPAClient } from "@/lib/supabase/client";
import { LogOut, Menu } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface AdminHeaderProps {
	user: User;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
	const router = useRouter();
	const [loggingOut, setLoggingOut] = useState(false);

	const handleLogout = async () => {
		setLoggingOut(true);
		const supabase = createSPAClient();
		await supabase.auth.signOut();
		router.push("/admin/login");
		router.refresh();
	};

	return (
		<header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-neutral-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
			{/* Mobile menu button */}
			<button type="button" className="lg:hidden -m-2.5 p-2.5 text-neutral-700">
				<span className="sr-only">Abrir menú</span>
				<Menu className="h-6 w-6" />
			</button>

			{/* Separator */}
			<div className="h-6 w-px bg-neutral-200 lg:hidden" />

			{/* Spacer */}
			<div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
				<div className="flex flex-1" />

				{/* User menu */}
				<div className="flex items-center gap-x-4 lg:gap-x-6">
					{/* User info */}
					<div className="hidden sm:block text-right">
						<p className="text-sm font-medium text-neutral-900">{user.user_metadata?.name || "Admin"}</p>
						<p className="text-xs text-neutral-500">{user.email}</p>
					</div>

					{/* Logout button */}
					<button
						onClick={handleLogout}
						disabled={loggingOut}
						className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors disabled:opacity-50"
						title="Cerrar sesión"
					>
						<LogOut className="h-5 w-5" />
						<span className="hidden sm:inline">{loggingOut ? "Cerrando..." : "Salir"}</span>
					</button>
				</div>
			</div>
		</header>
	);
}
