// Archivo: src/lib/auth-admin.ts
// Utilidades de autenticación para el panel admin

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Obtener cliente Supabase con cookies del servidor
 */
export async function createAdminClient() {
	const cookieStore = await cookies();

	return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
				} catch {
					// En Server Components, set() puede fallar - es esperado
				}
			},
		},
	});
}

/**
 * Verificar si el usuario actual está autenticado como admin
 * Redirige a login si no está autenticado
 */
export async function requireAdmin() {
	const supabase = await createAdminClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect("/admin/login");
	}

	return { user, supabase };
}

/**
 * Obtener usuario actual sin redirección
 */
export async function getCurrentUser() {
	const supabase = await createAdminClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user;
}

/**
 * Cerrar sesión de admin
 */
export async function signOutAdmin() {
	const supabase = await createAdminClient();
	await supabase.auth.signOut();
	redirect("/admin/login");
}
