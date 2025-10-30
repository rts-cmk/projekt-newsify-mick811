import { Accordion, AccordionItem } from "../components/accordion";
import { Footer, Header } from "../components/layout";
import { useFetchAllCategories } from "../hooks/useFetch";

export default function Popular() {
	const results = useFetchAllCategories("mostpopular");

	return (
		<>
			<Header search={false} />

			<main className="main-container">
				{results.flatMap(({ category, data }) =>
					data?.results?.length ? (
						<Accordion key={category} title={category}>
							{data.results.map((item) => {
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
										type="bookmark"
										title={item.title}
										abstract={item.abstract}
										imageUrl={imageUrl}
									/>
								);
							})}
						</Accordion>
					) : (
						[]
					),
				)}
			</main>

			<Footer />
		</>
	);
}
