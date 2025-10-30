import { Accordion, AccordionItem } from "../components/accordion";
import { Footer, Header } from "../components/layout";
import { useSettings } from "../context/settingsContext";
import { categories, categoryConfig, type Category } from "../hooks/useFetch";
import { useMemo } from "react";
import { useSearch } from "../context/searchContext";
import { useSearchByCategory } from "../hooks/useSearch";

export default function Archive() {
	const { settings, removeFromArchive } = useSettings();
	const { searchQuery } = useSearch();

	const groupedArchive = useMemo(() => {
		const archiveItems = Object.values(settings.archive) as (
			| TopStoriesResult
			| MostPopularResult
		)[];

		const grouped: Record<string, (TopStoriesResult | MostPopularResult)[]> =
			{};

		for (const item of archiveItems) {
			const itemSection = item.section.toLowerCase();
			const itemSubsection = item.subsection?.toLowerCase() || "";

			// Find which category this item belongs to
			let matchedCategory: Category | null = null;
			for (const category of categories) {
				const config = categoryConfig[category];
				if (
					config.sections.some(
						(section) =>
							itemSection === section.toLowerCase() ||
							itemSubsection === section.toLowerCase(),
					)
				) {
					matchedCategory = category;
					break;
				}
			}

			// If no category matches, skip it (or assign to a default category)
			if (matchedCategory) {
				if (!grouped[matchedCategory]) {
					grouped[matchedCategory] = [];
				}
				grouped[matchedCategory].push(item);
			}
		}

		// Convert to the format expected by useSearchByCategory
		return categories
			.filter((category) => grouped[category]?.length)
			.map((category) => ({
				category,
				data: { results: grouped[category] },
			}));
	}, [settings.archive]);

	const filteredResults = useSearchByCategory(groupedArchive, searchQuery);

	return (
		<>
			<Header />

			<main className="main-container">
				{filteredResults.map(({ category, items }) => (
					<Accordion key={category} title={category}>
						{items
							.filter((item) => item.title && item.title.trim())
							.map((item) => {
								let imageUrl: string | undefined;
								if ("multimedia" in item && item.multimedia) {
									const image = item.multimedia.find(
										(m: TopStoriesMultimedia) =>
											m.format === "threeByTwoSmallAt2X",
									);
									imageUrl = image?.url;
								} else if ("media" in item && item.media) {
									const mediaItem = item.media.find(
										(m: NYTMedia) => m.type === "image",
									);
									const metadata = mediaItem?.["media-metadata"]?.find(
										(m: NYTMediaMetadata) =>
											m.format === "mediumThreeByTwo210",
									);
									imageUrl = metadata?.url;
								}
								return (
									<AccordionItem
										key={item.uri}
										type="delete"
										title={item.title}
										abstract={item.abstract}
										imageUrl={imageUrl}
										onAction={() => removeFromArchive(item.uri)}
									/>
								);
							})}
					</Accordion>
				))}
			</main>

			<Footer />
		</>
	);
}