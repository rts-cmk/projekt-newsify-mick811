import Fuse from "fuse.js";
import { useMemo } from "react";
import type { Category } from "./useFetch";

interface SearchableItem {
	uri: string;
	title: string;
	abstract?: string;
	byline: string;
	section: string;
	subsection?: string;
	des_facet?: string[];
	org_facet?: string[];
	per_facet?: string[];
	geo_facet?: string[];
	category?: Category;
	multimedia?: TopStoriesMultimedia[];
	media?: NYTMedia[];
}

type SearchableItemType = TopStoriesResult | MostPopularResult;

interface SearchResult {
	category: Category;
	items: SearchableItemType[];
}

const fuseOptions = {
	keys: [
		{ name: "title", weight: 0.4 },
		{ name: "byline", weight: 0.2 },
		{ name: "section", weight: 0.15 },
		{ name: "subsection", weight: 0.1 },
		{ name: "des_facet", weight: 0.05 },
		{ name: "org_facet", weight: 0.05 },
		{ name: "per_facet", weight: 0.03 },
		{ name: "geo_facet", weight: 0.02 },
	],
	threshold: 0.4,
	includeScore: true,
	minMatchCharLength: 2,
};

export const useSearch = (
	items: SearchableItem[],
	searchQuery: string,
): SearchableItem[] => {
	const fuse = useMemo(() => {
		return new Fuse(items, fuseOptions);
	}, [items]);

	return useMemo(() => {
		if (!searchQuery.trim()) {
			return items;
		}

		const results = fuse.search(searchQuery);
		return results.map((result) => result.item);
	}, [fuse, searchQuery, items]);
};

export const useSearchByCategory = (
	results: Array<{
		category: Category;
		data?: { results: SearchableItemType[] };
	}>,
	searchQuery: string,
): SearchResult[] => {
	return useMemo(() => {
		if (!searchQuery.trim()) {
			return results
				.filter(
					(
						r,
					): r is {
						category: Category;
						data: { results: SearchableItemType[] };
					} => !!r.data?.results?.length,
				)
				.map((r) => ({
					category: r.category,
					items: r.data.results,
				}));
		}

		const searchableItems: Array<
			SearchableItemType & { category: Category }
		> = [];
		for (const result of results) {
			if (result.data?.results) {
				for (const item of result.data.results) {
					searchableItems.push({
						...item,
						category: result.category,
					});
				}
			}
		}

		const fuse = new Fuse(searchableItems, fuseOptions);
		const fuseResults = fuse.search(searchQuery);

		const groupedByCategory: Record<Category, SearchableItemType[]> =
			{} as Record<Category, SearchableItemType[]>;

		for (const result of fuseResults) {
			const category = result.item.category;
			if (!category) {
				continue;
			}
			if (!groupedByCategory[category]) {
				groupedByCategory[category] = [];
			}
			// Remove category from item before adding
			const { category: _, ...itemWithoutCategory } = result.item;
			groupedByCategory[category].push(
				itemWithoutCategory as SearchableItemType,
			);
		}

		return Object.entries(groupedByCategory).map(([category, items]) => ({
			category: category as Category,
			items,
		}));
	}, [results, searchQuery]);
};
