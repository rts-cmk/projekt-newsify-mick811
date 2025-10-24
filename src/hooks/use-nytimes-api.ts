import { useQuery } from "@tanstack/react-query";
import { type ArchivedArticle, getArchivedArticles } from "@/lib/archive";
import {
	fetchMostPopular,
	fetchTopStories,
	type NYTimesArticle,
	type NYTimesPopularArticle,
	nytimesQueryKeys,
} from "@/lib/nytimes-api";

export const useTopStories = (category: string) => {
	return useQuery<NYTimesArticle[]>({
		queryKey: nytimesQueryKeys.topStories(category),
		queryFn: () => fetchTopStories(category),
		staleTime: 1000 * 60 * 30,
		gcTime: 1000 * 60 * 60,
	});
};

export const useMostPopular = (category?: string) => {
	return useQuery<NYTimesPopularArticle[]>({
		queryKey: nytimesQueryKeys.popular(category),
		queryFn: () => fetchMostPopular(category),
		staleTime: 1000 * 60 * 30,
		gcTime: 1000 * 60 * 60,
	});
};

export const useArchive = () => {
	return useQuery<ArchivedArticle[]>({
		queryKey: ["archive"],
		queryFn: () => getArchivedArticles(),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});
};
