interface TopStoriesResponse {
	status: string;
	copyright: string;
	section: string;
	last_updated: string;
	num_results: number;
	results: TopStoriesResult[];
}

interface TopStoriesResult {
	section: string;
	subsection: string;
	title: string;
	abstract: string;
	url: string;
	uri: string;
	byline: string;
	item_type: TopStoriesItemType;
	updated_date: string;
	created_date: string;
	published_date: string;
	material_type_facet: string;
	kicker: string;
	des_facet: string[];
	org_facet: string[];
	per_facet: string[];
	geo_facet: string[];
	multimedia: TopStoriesMultimedia[];
	short_url: string;
}

interface TopStoriesMultimedia {
	url: string;
	format: TopStoriesFormat;
	height: number;
	width: number;
	type: "image";
	subtype: "photo";
	caption: string;
	copyright: string;
}

enum TopStoriesItemType {
	Article = "Article",
	Interactive = "Interactive",
}

enum TopStoriesFormat {
	LargeThumbnail = "Large Thumbnail",
	SuperJumbo = "Super Jumbo",
	ThreeByTwoSmallAt2X = "threeByTwoSmallAt2X",
}

interface MostPopularResponse {
	status: string;
	copyright: string;
	num_results: number;
	results: MostPopularResult[];
}

interface MostPopularResult {
	uri: string;
	url: string;
	id: number;
	asset_id: number;
	source: NYTSource;
	published_date: string;
	updated: string;
	section: string;
	subsection: string;
	nytdsection: string;
	adx_keywords: string;
	column: null | string;
	byline: string;
	type: NYTResultType;
	title: string;
	abstract: string;
	des_facet: string[];
	org_facet: string[];
	per_facet: string[];
	geo_facet: string[];
	media: NYTMedia[];
	eta_id: number;
}

interface NYTMedia {
	type: NYTMediaType;
	subtype: string;
	caption: string;
	copyright: string;
	approved_for_syndication: number;
	"media-metadata": NYTMediaMetadata[];
}

interface NYTMediaMetadata {
	url: string;
	format: NYTMediaFormat;
	height: number;
	width: number;
}

enum NYTMediaFormat {
	StandardThumbnail = "Standard Thumbnail",
	MediumThreeByTwo210 = "mediumThreeByTwo210",
	MediumThreeByTwo440 = "mediumThreeByTwo440",
}

enum NYTMediaType {
	Image = "image",
}

enum NYTSource {
	NewYorkTimes = "New York Times",
}

enum NYTResultType {
	Article = "Article",
	Interactive = "Interactive",
}
