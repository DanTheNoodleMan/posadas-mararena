import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Bienvenidos from "@/components/sections/Bienvenidos";
import Servicios from "@/components/sections/Servicios";
import Posadas from "@/components/sections/Posadas";
import Galeria from "@/components/sections/Galeria";
import Ubicacion from "@/components/sections/Ubicacion";
import FooterCTA from "@/components/sections/FooterCTA";

export default function Home() {
	return (
		<>
			<Header />
			<main>
				<Hero />
				<Bienvenidos />
				<Servicios />
				<Posadas />
				<Galeria />
				<Ubicacion />
				<FooterCTA />
			</main>
		</>
	);
}
