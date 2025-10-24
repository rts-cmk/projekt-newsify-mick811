import { createFileRoute } from "@tanstack/react-router";
import { CategoryList } from "@/components/category-list";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useMostPopular } from "@/hooks/use-nytimes-api";
import { type Category, getCategories } from "@/lib/feed-categories";

export const Route = createFileRoute("/(authenticated)/popular")({
	component: RouteComponent,
});

const PopularCategorySection = ({ category }: { category: Category }) => {
	const queryResult = useMostPopular(category);

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
					<PopularCategorySection key={category} category={category} />
				))}
			</div>
			<Footer />
		</div>
	);
}
