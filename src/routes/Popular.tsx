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
							{data.results.map((item) => (
								<AccordionItem key={item.uri} type="bookmark">
									{item.title}
								</AccordionItem>
							))}
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
