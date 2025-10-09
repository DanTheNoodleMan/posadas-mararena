// src/components/admin/AdminSidebar.tsx
// Sidebar de navegación del panel admin
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Calendar, FileText, PlusCircle, BarChart3, Settings, Home } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface NavItem {
	name: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
	{ name: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ name: "Reservas", href: "/admin/reservas", icon: FileText },
	{ name: "Nueva Reserva", href: "/admin/reservas/nueva", icon: PlusCircle },
	{ name: "Calendario", href: "/admin/calendario", icon: Calendar },
	{ name: "Reportes", href: "/admin/reportes", icon: BarChart3 },
	{ name: "Configuración", href: "/admin/configuracion", icon: Settings },
];

interface AdminSidebarProps {
	user: User;
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
	const pathname = usePathname();

	return (
		<>
			{/* Desktop Sidebar */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
				<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-900 px-6 pb-4">
					{/* Logo */}
					<div className="flex h-20 shrink-0 items-center border-b border-primary-700">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center">
								<span className="text-primary-900 font-bold text-lg">M</span>
							</div>
							<div>
								<h1 className="text-white font-bold text-lg">Mararena</h1>
								<p className="text-primary-300 text-xs">Panel Admin</p>
							</div>
						</div>
					</div>

					{/* Navigation */}
					<nav className="flex flex-1 flex-col">
						<ul className="flex flex-1 flex-col gap-y-7">
							<li>
								<ul className="-mx-2 space-y-1">
									{navigation.map((item) => {
										const isActive = pathname === item.href;
										return (
											<li key={item.name}>
												<Link
													href={item.href}
													className={`
                            group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 transition-all
                            ${isActive ? "bg-primary-800 text-white" : "text-primary-200 hover:text-white hover:bg-primary-800"}
                          `}
												>
													<item.icon className="h-5 w-5 shrink-0" />
													{item.name}
												</Link>
											</li>
										);
									})}
								</ul>
							</li>

							{/* User Info */}
							<li className="mt-auto">
								<div className="flex items-center gap-x-4 px-3 py-3 text-sm font-semibold leading-6 text-white border-t border-primary-700">
									<div className="h-8 w-8 rounded-full bg-accent-500 flex items-center justify-center">
										<span className="text-primary-900 font-bold text-sm">{user.email?.[0].toUpperCase()}</span>
									</div>
									<span className="sr-only">Tu perfil</span>
									<div className="flex-1">
										<p className="text-xs text-primary-300 truncate">{user.email}</p>
									</div>
								</div>

								{/* Link to main site */}
								<Link
									href="/"
									className="group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-primary-200 hover:text-white hover:bg-primary-800 transition-all"
								>
									<Home className="h-5 w-5 shrink-0" />
									Ver Sitio Web
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>

			{/* Mobile Sidebar - TODO: Implement mobile menu */}
		</>
	);
}
