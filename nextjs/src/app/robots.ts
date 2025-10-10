// ==============================================
// ROBOTS.TXT AUTOMÁTICO
// ==============================================

// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = "https://posadasmararena.com"; // SIN www

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/admin/*", // Bloquear panel admin
					"/api/*", // Bloquear APIs
					"/dashboard/*", // Bloquear dashboard si existe
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
