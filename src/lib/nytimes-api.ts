const API_KEY = import.meta.env.VITE_NYTIMES_API_KEY || "";

if (!API_KEY) {
	console.warn("VITE_NYTIMES_API_KEY is not set. NYTimes API calls will fail.");
}

export type NYTimesArticle = {
	section: string;
	subsection: string;
	title: string;
	abstract: string;
	url: string;
	uri: string;
	byline: string;
	item_type: string;
	updated_date: string;
	created_date: string;
	published_date: string;
	material_type_facet: string;
	kicker: string;
	des_facet: string[];
	org_facet: string[];
	per_facet: string[];
	geo_facet: string[];
	multimedia: {
		url: string;
		format: string;
		height: number;
		width: number;
		type: string;
		subtype: string;
		caption: string;
		copyright: string;
	}[];
	short_url: string;
};

export type NYTimesPopularArticle = {
	uri: string;
	url: string;
	id: number;
	asset_id: number;
	source: string;
	published_date: string;
	updated: string;
	section: string;
	subsection: string;
	nytdsection: string;
	adx_keywords: string;
	column: string | null;
	byline: string;
	type: string;
	title: string;
	abstract: string;
	des_facet: string[];
	org_facet: string[];
	per_facet: string[];
	geo_facet: string[];
	media: {
		type: string;
		subtype: string;
		caption: string;
		copyright: string;
		approved_for_syndication: number;
		"media-metadata": {
			url: string;
			format: string;
			height: number;
			width: number;
		}[];
	}[];
	eta_id: number;
};

export type NYTimesArchiveArticle = {
	abstract: string;
	web_url: string;
	snippet: string;
	lead_paragraph: string;
	source: string;
	multimedia: {
		rank: number;
		subtype: string;
		caption: string | null;
		credit: string | null;
		type: string;
		url: string;
		height: number;
		width: number;
		legacy: Record<string, unknown>;
		subType: string;
		crop_name: string;
	}[];
	headline: {
		main: string;
		kicker: string | null;
		content_kicker: string | null;
		print_headline: string | null;
		name: string | null;
		seo: string | null;
		sub: string | null;
	};
	keywords: {
		name: string;
		value: string;
		rank: number;
		major: string;
	}[];
	pub_date: string;
	document_type: string;
	news_desk: string;
	section_name: string;
	byline: {
		original: string | null;
		person: {
			firstname: string;
			middlename: string | null;
			lastname: string;
			qualifier: string | null;
			title: string | null;
			role: string;
			organization: string;
			rank: number;
		}[];
		organization: string | null;
	};
	type_of_material: string;
	_id: string;
	word_count: number;
	uri: string;
};

/**
 * Fetch top stories by category from NYTimes API
 * https://developer.nytimes.com/docs/top-stories-product/1/overview
 */
export const fetchTopStories = async (
	category: string,
): Promise<NYTimesArticle[]> => {
	const url = new URL(
		`https://api.nytimes.com/svc/topstories/v2/${category}.json`,
	);
	url.searchParams.set("api-key", API_KEY);

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch top stories: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data.results;
};

/**
 * Fetch most popular articles (emailed) from NYTimes API
 * https://developer.nytimes.com/docs/most-popular-product/1/overview
 */
export const fetchMostPopular = async (
	category?: string,
): Promise<NYTimesPopularArticle[]> => {
	const url = new URL(
		"https://api.nytimes.com/svc/mostpopular/v2/emailed/7.json",
	);
	url.searchParams.set("api-key", API_KEY);

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch popular articles: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();
	const results: NYTimesPopularArticle[] = data.results;

	// Filter by category if provided
	if (category) {
		return results.filter(
			(item) => item.nytdsection?.toLowerCase() === category.toLowerCase(),
		);
	}

	return results;
};

/**
 * Fetch archive articles by year and month from NYTimes API
 * https://developer.nytimes.com/docs/archive-product/1/overview
 */
export const fetchArchive = async (
	year: number,
	month: number,
): Promise<NYTimesArchiveArticle[]> => {
	const url = new URL(
		`https://api.nytimes.com/svc/archive/v1/${year}/${month}.json`,
	);
	url.searchParams.set("api-key", API_KEY);

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch archive: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data.response.docs;
};

export const nytimesQueryKeys = {
	topStories: (category: string) =>
		["nytimes", "topStories", category] as const,
	popular: (category?: string) => ["nytimes", "popular", category] as const,
	archive: (year: number, month: number) =>
		["nytimes", "archive", year, month] as const,
};
