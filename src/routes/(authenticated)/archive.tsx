import { createFileRoute } from "@tanstack/react-router";
import { CategoryList } from "@/components/category-list";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useArchive } from "@/hooks/use-nytimes-api";
import { type Category, getCategories } from "@/lib/feed-categories";

export const Route = createFileRoute("/(authenticated)/archive")({
	component: RouteComponent,
});

const ArchiveCategorySection = ({ category }: { category: Category }) => {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1; // 0-indexed

	const queryResult = useArchive(year, month);

	return (
		<details>
			<summary>
				{category.slice(0, 1).toUpperCase() + category.slice(1)}
			</summary>
			<CategoryList queryResult={queryResult} />
		</details>
	);
};

function RouteComponent() {
	const categories = getCategories();

	return (
		<div className="authenticated-page">
			<Header />
			<div className="authenticated-page__content">
				{categories.map((category) => (
					<ArchiveCategorySection key={category} category={category} />
				))}
			</div>
			<Footer />
		</div>
	);
}
