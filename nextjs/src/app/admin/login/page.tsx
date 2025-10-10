// src/app/admin/login/page.tsx
// Página de login para panel administrativo
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSPAClient } from "@/lib/supabase/client";
import { Lock, User, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const supabase = createSPAClient();

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setError("Credenciales incorrectas. Por favor intenta de nuevo.");
			setLoading(false);
		} else {
			router.push("/admin");
			router.refresh();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-500 mb-4">
						<Lock className="w-10 h-10 text-primary-900" />
					</div>
					<h1 className="text-3xl font-bold text-white mb-2">Panel Administrativo</h1>
					<p className="text-primary-200">Mararena Posadas</p>
				</div>

				{/* Login Form */}
				<div className="bg-white rounded-2xl shadow-2xl p-8">
					<form onSubmit={handleLogin} className="space-y-6">
						{/* Email */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
								Correo Electrónico
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
									placeholder="admin@mararenaposadas.com"
								/>
							</div>
						</div>

						{/* Password */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
								Contraseña
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
								<input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
									placeholder="••••••••"
								/>
							</div>
						</div>

						{/* Error Message */}
						{error && (
							<div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
								<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
								<p className="text-sm text-red-700">{error}</p>
							</div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Iniciando sesión..." : "Iniciar Sesión"}
						</button>
					</form>

					{/* Info */}
					<div className="mt-6 pt-6 border-t border-neutral-200">
						<p className="text-xs text-neutral-500 text-center">
							Credenciales por defecto:
							<br />
							<code className="bg-neutral-100 px-2 py-1 rounded text-neutral-700">mararenaposadas@gmail.com</code>
						</p>
					</div>
				</div>

				{/* Back to site */}
				<div className="text-center mt-6">
					<a href="/" className="text-sm text-primary-100 hover:text-white transition-colors">
						← Volver al sitio principal
					</a>
				</div>
			</div>
		</div>
	);
}
