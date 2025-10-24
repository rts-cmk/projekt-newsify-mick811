import type { UseQueryResult } from "@tanstack/react-query";
import type { ArchivedArticle } from "@/lib/archive";
import { addToArchive } from "@/lib/archive";
import type { NYTimesArticle, NYTimesPopularArticle } from "@/lib/nytimes-api";

interface ArticleAdapter {
	readonly id: string;
	readonly title: string;
	readonly abstract: string;
	readonly url: string;
	readonly publishedDate: string;
	readonly byline: string | null;
}

class TopStoryAdapter implements ArticleAdapter {
	constructor(private article: NYTimesArticle) {}

	get id() {
		return this.article.uri;
	}
	get title() {
		return this.article.title;
	}
	get abstract() {
		return this.article.abstract;
	}
	get url() {
		return this.article.url;
	}
	get publishedDate() {
		return this.article.published_date;
	}
	get byline() {
		return this.article.byline || null;
	}
}

class PopularArticleAdapter implements ArticleAdapter {
	constructor(private article: NYTimesPopularArticle) {}

	get id() {
		return String(this.article.id);
	}
	get title() {
		return this.article.title;
	}
	get abstract() {
		return this.article.abstract;
	}
	get url() {
		return this.article.url;
	}
	get publishedDate() {
		return this.article.published_date;
	}
	get byline() {
		return this.article.byline || null;
	}
}

class ArchivedArticleAdapter implements ArticleAdapter {
	constructor(private article: ArchivedArticle) {}

	get id() {
		return "uri" in this.article ? this.article.uri : String(this.article);
	}
	get title() {
		return this.article.title;
	}
	get abstract() {
		return this.article.abstract;
	}
	get url() {
		return this.article.url;
	}
	get publishedDate() {
		return this.article.published_date;
	}
	get byline() {
		return this.article.byline || null;
	}
}

const createArticleAdapter = (
	article: NYTimesArticle | NYTimesPopularArticle | ArchivedArticle,
): ArticleAdapter => {
	if ("archivedAt" in article) return new ArchivedArticleAdapter(article);
	if ("asset_id" in article) return new PopularArticleAdapter(article);
	return new TopStoryAdapter(article);
};

const ArticleCard = ({
	article,
	rawArticle,
}: {
	article: ArticleAdapter;
	rawArticle: NYTimesArticle | NYTimesPopularArticle | ArchivedArticle;
}) => {
	const handleClick = () => {
		// Don't re-archive already archived articles
		if (!("archivedAt" in rawArticle)) {
			addToArchive(rawArticle);
		}
	};

	return (
		<article className="p-4 border rounded-lg hover:shadow-md transition-shadow">
			<a
				href={article.url}
				target="_blank"
				rel="noopener noreferrer"
				className="block"
				onClick={handleClick}
			>
				<h3 className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors">
					{article.title}
				</h3>
				{article.abstract && (
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
						{article.abstract}
					</p>
				)}
				{article.byline && (
					<p className="text-xs text-gray-500 dark:text-gray-500">
						{article.byline}
					</p>
				)}
			</a>
		</article>
	);
};

type ArticleType = NYTimesArticle | NYTimesPopularArticle | ArchivedArticle;

export function CategoryList<T extends ArticleType>({
	queryResult,
}: Readonly<{
	queryResult: UseQueryResult<T[], Error>;
}>) {
	const { data } = queryResult;

	if (!data || data.length === 0) return null;

	return (
		<div className="space-y-4">
			{data.map((article) => {
				const adapter = createArticleAdapter(article);
				return (
					<ArticleCard
						key={adapter.id}
						article={adapter}
						rawArticle={article}
					/>
				);
			})}
		</div>
	);
}
