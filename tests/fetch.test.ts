import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Category } from "../src/hooks/useFetch";
import { fetchMostPopular, fetchTopStories } from "../src/hooks/useFetch";

const mockResponse = (body: any, ok = true) => ({
	ok,
	json: async () => body,
});

describe("fetch helpers", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("fetchTopStories returns parsed top stories response when fetch ok", async () => {
		const body = {
			status: "OK",
			copyright: "© Test",
			section: "world",
			last_updated: "2025-10-31T00:00:00Z",
			num_results: 1,
			results: [
				{
					section: "world",
					subsection: "",
					title: "Test Headline",
					abstract: "Test abstract",
					url: "https://example.com/article",
					uri: "nyt://article/test-1",
					byline: "By Tester",
					item_type: "Article",
					updated_date: "2025-10-31T00:00:00Z",
					created_date: "2025-10-31T00:00:00Z",
					published_date: "2025-10-31T00:00:00Z",
					material_type_facet: "",
					kicker: "",
					des_facet: [],
					org_facet: [],
					per_facet: [],
					geo_facet: [],
					multimedia: [],
					short_url: "https://nyti.ms/test",
				},
			],
		};

		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValueOnce(mockResponse(body)),
		);

		const res = await fetchTopStories("europe" as Category, "DUMMY_KEY");

		expect(res.status).toBe("OK");
		expect(res.results[0].title).toBe("Test Headline");
	});

	it("fetchMostPopular deduplicates and filters by category sections", async () => {
		// category 'europe' maps to sections ['world','europe']
		const articleA = {
			id: 1,
			section: "World",
			subsection: "",
			title: "A",
			abstract: "",
			uri: "uri-a",
			url: "",
			asset_id: 1,
			source: "New York Times",
			published_date: "",
			updated: "",
			nytdsection: "",
			adx_keywords: "",
			column: null,
			byline: "",
			type: "Article",
			des_facet: [],
			org_facet: [],
			per_facet: [],
			geo_facet: [],
			media: [],
			eta_id: 0,
		};
		const articleB = {
			id: 2,
			section: "Sports",
			subsection: "",
			title: "B",
			abstract: "",
			uri: "uri-b",
			url: "",
			asset_id: 2,
			source: "New York Times",
			published_date: "",
			updated: "",
			nytdsection: "",
			adx_keywords: "",
			column: null,
			byline: "",
			type: "Article",
			des_facet: [],
			org_facet: [],
			per_facet: [],
			geo_facet: [],
			media: [],
			eta_id: 0,
		};
		const articleADuplicate = { ...articleA };

		const resp1 = {
			status: "OK",
			copyright: "©",
			num_results: 2,
			results: [articleA, articleB],
		};
		const resp2 = {
			status: "OK",
			copyright: "©",
			num_results: 1,
			results: [articleADuplicate],
		};
		const resp3 = {
			status: "OK",
			copyright: "©",
			num_results: 0,
			results: [],
		};

		// stub three sequential fetch calls
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValueOnce(mockResponse(resp1))
				.mockResolvedValueOnce(mockResponse(resp2))
				.mockResolvedValueOnce(mockResponse(resp3)),
		);

		const res = await fetchMostPopular("europe" as Category, "DUMMY_KEY");

		// after dedupe, only articleA remains from resp1/resp2, articleB filtered out (section 'Sports')
		expect(res.results.some((r: any) => r.id === 1)).toBe(true);
		expect(res.results.some((r: any) => r.id === 2)).toBe(false);
		expect(res.num_results).toBe(res.results.length);
	});
});
