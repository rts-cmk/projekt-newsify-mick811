import type { NYTimesArticle, NYTimesPopularArticle } from "@/lib/nytimes-api";

const ARCHIVE_KEY = "newsify_archive";
const MAX_ARCHIVE_SIZE = 100;

export type ArchivedArticle = (NYTimesArticle | NYTimesPopularArticle) & {
	archivedAt: string;
};

export const getArchivedArticles = (): ArchivedArticle[] => {
	if (typeof window === "undefined") return [];

	try {
		const stored = localStorage.getItem(ARCHIVE_KEY);
		if (!stored) return [];
		return JSON.parse(stored);
	} catch {
		return [];
	}
};

export const addToArchive = (
	article: NYTimesArticle | NYTimesPopularArticle,
): void => {
	if (typeof window === "undefined") return;

	try {
		const archived = getArchivedArticles();
		const articleId = "uri" in article ? article.uri : String(article);

		// Check if already archived
		const exists = archived.some((a) => {
			const id = "uri" in a ? a.uri : String(a);
			return id === articleId;
		});

		if (exists) return;

		// Add new article with timestamp
		const newArticle: ArchivedArticle = {
			...article,
			archivedAt: new Date().toISOString(),
		};

		// Keep only the most recent MAX_ARCHIVE_SIZE articles
		const updated = [newArticle, ...archived].slice(0, MAX_ARCHIVE_SIZE);

		localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updated));
	} catch (error) {
		console.error("Failed to add to archive:", error);
	}
};

export const removeFromArchive = (articleId: string): void => {
	if (typeof window === "undefined") return;

	try {
		const archived = getArchivedArticles();
		const updated = archived.filter((a) => {
			const id = "uri" in a ? a.uri : String(a);
			return id !== articleId;
		});

		localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updated));
	} catch (error) {
		console.error("Failed to remove from archive:", error);
	}
};

export const clearArchive = (): void => {
	if (typeof window === "undefined") return;

	try {
		localStorage.removeItem(ARCHIVE_KEY);
	} catch (error) {
		console.error("Failed to clear archive:", error);
	}
};
