import { useQueries, useQuery } from "@tanstack/react-query";
import { getCategoryUrls, NYT_RSS_BASE_URL } from "@/lib/feed-categories";
import { getRSSFeed, type RSSFeed, rssQueryKey } from "@/lib/rss";

export function useRssFeed(category: string) {
	const feedUrl = `${NYT_RSS_BASE_URL}${category}.xml`;
	return useQuery<RSSFeed>({
		queryKey: rssQueryKey(feedUrl),
		queryFn: () => getRSSFeed(feedUrl),
		staleTime: 1000 * 60 * 5,
	});
}

export function useAllRssFeeds() {
	const categoryUrls = getCategoryUrls();

	return useQueries({
		queries: categoryUrls.map((url) => ({
			queryKey: rssQueryKey(url),
			queryFn: () => getRSSFeed(url),
			staleTime: 1000 * 60 * 5,
		})),
	});
}
