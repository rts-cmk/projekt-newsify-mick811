import { queryOptions } from "@tanstack/react-query";
import { NYT_RSS_BASE_URL } from "@/lib/feed-categories";
import { getUser } from "./functions";
import { getRSSFeed } from "./rss";

export const authQueryOptions = () =>
	queryOptions({
		queryKey: ["user"],
		queryFn: ({ signal }) => getUser({ signal }),
	});

export const rssFeedOptions = (category: string) =>
	queryOptions({
		queryKey: ["rssFeed", `${NYT_RSS_BASE_URL}${category}.xml`],
		queryFn: () => getRSSFeed(`${NYT_RSS_BASE_URL}${category}.xml`),
		staleTime: 1000 * 60 * 5,
	});

export const rssFeedUrlOptions = (url: string) =>
	queryOptions({
		queryKey: ["rssFeed", url],
		queryFn: () => getRSSFeed(url),
		staleTime: 1000 * 60 * 5,
	});

export type AuthQueryResult = Awaited<ReturnType<typeof getUser>>;
export type RssFeedQueryResult = Awaited<ReturnType<typeof getRSSFeed>>;
