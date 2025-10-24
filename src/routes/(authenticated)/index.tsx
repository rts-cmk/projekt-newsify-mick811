import { createFileRoute } from "@tanstack/react-router";
import { CategoryList } from "@/components/category-list";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useTopStories } from "@/hooks/use-nytimes-api";
import { type Category, getCategories } from "@/lib/feed-categories";

export const Route = createFileRoute("/(authenticated)/")({
	component: RouteComponent,
});

const TopStoriesCategorySection = ({ category }: { category: Category }) => {
	const queryResult = useTopStories(category);

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
			<Header showSearch={true} />
			<div className="authenticated-page__content">
				{categories.map((category) => (
					<TopStoriesCategorySection key={category} category={category} />
				))}
			</div>
			<Footer />
		</div>
	);
}
