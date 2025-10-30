import { Accordion, AccordionItem } from "../components/accordion";
import { Footer, Header } from "../components/layout";
import { useSettings } from "../context/settingsContext";
import { categories, categoryConfig, type Category } from "../hooks/useFetch";
import { useMemo } from "react";

export default function Archive() {
	const { settings, removeFromArchive } = useSettings();

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

		return grouped;
	}, [settings.archive]);

	return (
		<>
			<Header search={false} />

			<main className="main-container">
				{categories
					.filter((category) => groupedArchive[category]?.length)
					.map((category) => (
						<Accordion key={category} title={category}>
							{groupedArchive[category]
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
