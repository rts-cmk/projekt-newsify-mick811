export const NYT_RSS_BASE_URL = "https://rss.nytimes.com/services/xml/rss/nyt/";

export const DEFAULT_CATEGORIES = [
	"europe",
	"health",
	"sports",
	"business",
	"travel",
] as const;

export type Category = (typeof DEFAULT_CATEGORIES)[number];

const LOCAL_STORAGE_KEY = "rss_categories";

export const ensureCategoriesStored = () => {
	if (typeof window === "undefined") return;
	const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (!raw) {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
	}
};

export const getCategories = (): Category[] => {
	if (typeof window === "undefined") return [...DEFAULT_CATEGORIES];
	try {
		const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : null;
		const array = Array.isArray(parsed) ? parsed : DEFAULT_CATEGORIES;
		return array.filter((c: string) =>
			(DEFAULT_CATEGORIES as readonly string[]).includes(c),
		) as Category[];
	} catch {
		return [...DEFAULT_CATEGORIES];
	}
};

export const getCategoryUrls = (): string[] =>
	getCategories().map((c) => `${NYT_RSS_BASE_URL}${c}.xml`);
