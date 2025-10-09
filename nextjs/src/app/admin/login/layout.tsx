// src/app/admin/login/layout.tsx
// Layout específico para login (sin requerir autenticación)

export const metadata = {
	title: "Login - Panel Admin Mararena",
	description: "Acceso al panel administrativo",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
