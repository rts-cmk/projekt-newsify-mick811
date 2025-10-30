import { Accordion, AccordionItem } from "../components/accordion";
import { Footer, Header } from "../components/layout";
import { useSearch } from "../context/searchContext";
import { useSettings } from "../context/settingsContext";
import { useFetchAllCategories } from "../hooks/useFetch";
import { useSearchByCategory } from "../hooks/useSearch";

export default function Popular() {
	const results = useFetchAllCategories("mostpopular");
	const { addToArchive } = useSettings();
	const { searchQuery } = useSearch();
	const filteredResults = useSearchByCategory(results, searchQuery);

	return (
		<>
			<Header />

			<main className="main-container">
				{filteredResults.map(({ category, items }) => (
					<Accordion key={category} title={category}>
						{items
							.filter((item) => item.title?.trim())
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
									const metadata = mediaItem?.[
										"media-metadata"
									]?.find(
										(m: NYTMediaMetadata) =>
											m.format === "mediumThreeByTwo210",
									);
									imageUrl = metadata?.url;
								}
								return (
									<AccordionItem
										key={item.uri}
										type="bookmark"
										title={item.title}
										abstract={item.abstract}
										imageUrl={imageUrl}
										onAction={() => addToArchive(item)}
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
