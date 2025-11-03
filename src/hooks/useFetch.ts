import { useQueries, useQuery } from "@tanstack/react-query";
import { useSettings } from "../context/settingsContext";

type FetchType = "topstories" | "mostpopular";

export const categories = [
	"europe",
	"health",
	"sports",
	"business",
	"travel",
] as const;

export type Category = (typeof categories)[number];

export const categoryConfig: Record<
	Category,
	{ apiSection: string; sections: string[] }
> = {
	europe: { apiSection: "world", sections: ["world", "europe"] },
	health: { apiSection: "health", sections: ["health", "well"] },
	sports: { apiSection: "sports", sections: ["sports"] },
	business: { apiSection: "business", sections: ["business", "economy"] },
	travel: { apiSection: "travel", sections: ["travel"] },
};

const MOST_POPULAR_PERIODS = [1, 7, 30];
const NYTIMES_API_KEY = import.meta.env.VITE_NYTIMES_API_KEY;

interface UseFetchProps {
	type: FetchType;
	category: Category;
}

export const fetchTopStories = async (category: Category, apiKey: string) => {
	const { apiSection } = categoryConfig[category];
	const url = `https://api.nytimes.com/svc/topstories/v2/${apiSection}.json?api-key=${apiKey}`;

	const response = await fetch(url);
	if (!response.ok) throw new Error("Failed to fetch top stories");

	return (await response.json()) as TopStoriesResponse;
};

export const fetchMostPopular = async (category: Category, apiKey: string) => {
	const { sections } = categoryConfig[category];

	const responses = await Promise.all(
		MOST_POPULAR_PERIODS.map(async (period) => {
			const url = `https://api.nytimes.com/svc/mostpopular/v2/emailed/${period}.json?api-key=${apiKey}`;
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`Failed to fetch ${period}-day data`);
			}

			return (await response.json()) as MostPopularResponse;
		}),
	);

	const allArticles = responses.flatMap((response) => response.results);

	const uniqueArticles = Array.from(
		new Map(allArticles.map((article) => [article.id, article])).values(),
	);

	const filteredArticles = uniqueArticles.filter((article) => {
		const articleSection = article.section.toLowerCase();
		const articleSubsection = article.subsection?.toLowerCase() || "";

		return sections.some(
			(section) =>
				articleSection === section.toLowerCase() ||
				articleSubsection === section.toLowerCase(),
		);
	});

	return {
		status: "OK",
		copyright: responses[0].copyright,
		num_results: filteredArticles.length,
		results: filteredArticles,
	} as MostPopularResponse;
};

const fetchCategory = async (
	type: FetchType,
	category: Category,
	apiKey: string,
) => {
	if (type === "mostpopular") {
		return fetchMostPopular(category, apiKey);
	}

	return fetchTopStories(category, apiKey);
};

export const useFetch = ({ type, category }: UseFetchProps) => {
	return useQuery({
		queryKey: [type, category],
		queryFn: () => fetchCategory(type, category, NYTIMES_API_KEY),
	});
};

export const useFetchAllCategories = (type: FetchType) => {
	const { settings } = useSettings();

	const enabledCategories = categories.filter(
		(category) => settings.categories[category] === true,
	);

	const queries = useQueries({
		queries: enabledCategories.map((category) => ({
			queryKey: [type, category],
			queryFn: () => fetchCategory(type, category, NYTIMES_API_KEY),
		})),
	});

	return queries.map((query, index) => ({
		category: enabledCategories[index],
		...query,
	}));
};
