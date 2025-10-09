// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import { ClientType, SassClient } from "@/lib/supabase/unified";

export function createSPAClient() {
	return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

// Alias para compatibilidad con componentes admin
export const createClient = createSPAClient;

export async function createSPASassClient() {
	const client = createSPAClient();
	return new SassClient(client, ClientType.SPA);
}

export async function createSPASassClientAuthenticated() {
	const client = createSPAClient();
	const user = await client.auth.getSession();
	if (!user.data || !user.data.session) {
		window.location.href = "/auth/login";
	}
	return new SassClient(client, ClientType.SPA);
}
