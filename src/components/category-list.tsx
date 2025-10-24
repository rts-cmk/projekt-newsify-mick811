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
		<li className="category-list__item">
			<article className="article-card">
				<a
					href={article.url}
					target="_blank"
					rel="noopener noreferrer"
					className="article-card__link"
					onClick={handleClick}
				>
					<h3 className="article-card__title">{article.title}</h3>
					{article.abstract && (
						<p className="article-card__abstract">{article.abstract}</p>
					)}
					{article.byline && (
						<p className="article-card__byline">{article.byline}</p>
					)}
				</a>
			</article>
		</li>
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
		<ul className="category-list">
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
		</ul>
	);
}
