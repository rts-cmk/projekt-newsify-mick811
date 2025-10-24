import { createFileRoute } from "@tanstack/react-router";
import { CategoryList } from "@/components/category-list";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useArchive } from "@/hooks/use-nytimes-api";

export const Route = createFileRoute("/(authenticated)/archive")({
	component: RouteComponent,
});

function RouteComponent() {
	const queryResult = useArchive();

	return (
		<div className="authenticated-page">
			<Header />
			<div className="authenticated-page__content">
				<CategoryList queryResult={queryResult} />
			</div>
			<Footer />
		</div>
	);
}
