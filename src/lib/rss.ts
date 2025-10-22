import { DOMParser } from "@xmldom/xmldom";

export type RSSFeedItem = {
	title?: string;
	description?: string;
	author?: string;
	publishedAt?: string;
	link?: string;
};

export type RSSFeed = {
	title?: string;
	link?: string;
	description?: string;
	items: RSSFeedItem[];
};

const extractText =
	({ element }: { element: Element | Document }) =>
	(tagName: string) =>
		element?.getElementsByTagName(tagName)?.item(0)?.textContent;

const parseRSSItem = (item: Element): RSSFeedItem => {
	const getText = extractText({ element: item });

	return {
		title: getText("title"),
		description: getText("description"),
		author: getText("dc:creator") || getText("author"),
		publishedAt: getText("pubDate"),
		link: getText("link"),
	};
};

const parseRSSDocument = (doc: Document): RSSFeed => {
	const getText = extractText({ element: doc });

	const items = Array.from({ length: doc.getElementsByTagName("item").length })
		.map((_, i) => doc.getElementsByTagName("item").item(i))
		.filter(Boolean)
		.map((item) => parseRSSItem(item as Element));

	return {
		title: getText("title"),
		link: getText("link"),
		description: getText("description"),
		items,
	};
};

export const getRSSFeed = async (url: string): Promise<RSSFeed> => {
	const xml = await fetch(url).then((res) => res.text());
	const doc = new DOMParser().parseFromString(xml, "application/xml");
	return parseRSSDocument(doc);
};

export const rssQueryKey = (url: string) => ["rssFeed", url] as const;
