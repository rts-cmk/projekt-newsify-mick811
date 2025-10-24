import { useQuery } from "@tanstack/react-query";
import {
	fetchArchive,
	fetchMostPopular,
	fetchTopStories,
	type NYTimesArchiveArticle,
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

export const useArchive = (year: number, month: number) => {
	return useQuery<NYTimesArchiveArticle[]>({
		queryKey: nytimesQueryKeys.archive(year, month),
		queryFn: () => fetchArchive(year, month),
		staleTime: 1000 * 60 * 60 * 24,
		gcTime: 1000 * 60 * 60 * 24 * 7,
		enabled: year > 0 && month > 0 && month <= 12,
	});
};
