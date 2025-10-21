import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export const Route = createFileRoute("/(authenticated)/archive")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="authenticated-page">
			<Header />
			<div className="authenticated-page__content">
				<h1>Archive</h1>
			</div>
			<Footer />
		</div>
	);
}
