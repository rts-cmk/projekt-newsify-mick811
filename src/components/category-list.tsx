import type { UseQueryResult } from "@tanstack/react-query";
import type {
	NYTimesArchiveArticle,
	NYTimesArticle,
	NYTimesPopularArticle,
} from "@/lib/nytimes-api";

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

class ArchiveArticleAdapter implements ArticleAdapter {
	constructor(private article: NYTimesArchiveArticle) {}

	get id() {
		return this.article._id;
	}
	get title() {
		return this.article.headline.main;
	}
	get abstract() {
		return this.article.abstract || this.article.snippet || "";
	}
	get url() {
		return this.article.web_url;
	}
	get publishedDate() {
		return this.article.pub_date;
	}
	get byline() {
		return this.article.byline?.original || null;
	}
}

const createArticleAdapter = (
	article: NYTimesArticle | NYTimesPopularArticle | NYTimesArchiveArticle,
): ArticleAdapter => {
	if ("headline" in article) return new ArchiveArticleAdapter(article);
	if ("asset_id" in article) return new PopularArticleAdapter(article);
	return new TopStoryAdapter(article);
};

const ArticleCard = ({ article }: { article: ArticleAdapter }) => (
	<article className="p-4 border rounded-lg hover:shadow-md transition-shadow">
		<a
			href={article.url}
			target="_blank"
			rel="noopener noreferrer"
			className="block"
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

type ArticleType =
	| NYTimesArticle
	| NYTimesPopularArticle
	| NYTimesArchiveArticle;

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
				return <ArticleCard key={adapter.id} article={adapter} />;
			})}
		</div>
	);
}
