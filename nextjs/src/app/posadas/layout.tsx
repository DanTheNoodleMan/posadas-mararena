import Header from "@/components/layout/Header";
import FooterCTA from "@/components/layout/FooterCTA";

export default function PosadasLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<main>{children}</main>
			<FooterCTA />
		</>
	);
}
