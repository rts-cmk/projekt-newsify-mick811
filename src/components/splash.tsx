import { useQueries } from "@tanstack/react-query";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useSplash } from "@/context/splash-context";
import { ensureCategoriesStored, getCategoryUrls } from "@/lib/feed-categories";
import { getRSSFeed, rssQueryKey } from "@/lib/rss";

export function Splash() {
	const { showSplash, resetSplash } = useSplash();
	const containerRef = useRef<HTMLDivElement>(null);
	const logoImgRef = useRef<HTMLImageElement>(null);
	const textRef = useRef<HTMLElement>(null);
	const dataFetchedRef = useRef(false);
	const prefetchedThisSessionRef = useRef(false);

	useEffect(() => {
		if (!showSplash) return;
		ensureCategoriesStored();
		// only once per session
		prefetchedThisSessionRef.current =
			sessionStorage.getItem("splash_prefetched") === "true";
		if (prefetchedThisSessionRef.current) {
			dataFetchedRef.current = true; // already prefetched earlier in this session
		}
	}, [showSplash]);

	const categoryUrls = getCategoryUrls();
	const queries = useQueries({
		queries: categoryUrls.map((url) => ({
			queryKey: rssQueryKey(url),
			queryFn: () => getRSSFeed(url),
			staleTime: 1000 * 60 * 5,
			enabled: showSplash && !prefetchedThisSessionRef.current,
		})),
	});

	// Dismiss after first success, or after a fallback timeout if all fail
	useEffect(() => {
		if (!showSplash || prefetchedThisSessionRef.current) return;
		const anySuccess =
			queries.length > 0 && queries.some((q) => q.status === "success");
		if (anySuccess) {
			dataFetchedRef.current = true;
			sessionStorage.setItem("splash_prefetched", "true");
			return;
		}

		const timeout = setTimeout(() => {
			// Avoid indefinite splash if upstream fails
			dataFetchedRef.current = true;
		}, 10000);

		return () => clearTimeout(timeout);
	}, [queries, showSplash]);

	// useLayoutEffect runs synchronously after DOM mutations but before browser paint
	// This ensures refs are available before animation starts
	useLayoutEffect(() => {
		if (
			!showSplash ||
			!containerRef.current ||
			!logoImgRef.current ||
			!textRef.current
		)
			return;

		// Create animation timeline
		const tl = gsap.timeline({
			onComplete: () => {
				// Only fade out if data has been fetched
				if (dataFetchedRef.current) {
					gsap.to(containerRef.current, {
						opacity: 0,
						scale: 0.95,
						duration: 0.8,
						ease: "power2.inOut",
						delay: 0.5,
						onComplete: resetSplash,
					});
				}
			},
		});

		// Initial states
		gsap.set(logoImgRef.current, { scale: 0.3, opacity: 0, rotate: -10 });
		gsap.set(textRef.current, { opacity: 0, y: 30, filter: "blur(6px)" });
		gsap.set(containerRef.current, { opacity: 1 });

		// Animation sequence
		tl.to(logoImgRef.current, {
			opacity: 1,
			scale: 1.05,
			rotate: 0,
			duration: 1.4,
			ease: "back.out(1.7)",
		})
			.to(
				logoImgRef.current,
				{
					scale: 1,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.3",
			)
			.to(
				textRef.current,
				{
					opacity: 1,
					y: 0,
					filter: "blur(0px)",
					duration: 1,
					ease: "power3.out",
				},
				"-=0.5",
			)
			.to(
				logoImgRef.current,
				{
					y: -10,
					repeat: dataFetchedRef.current ? 1 : Infinity,
					yoyo: true,
					duration: 1.2,
					ease: "sine.inOut",
				},
				"-=0.3",
			);

		// If data is fetched during animation, update the animation
		const checkDataInterval = setInterval(() => {
			if (dataFetchedRef.current && logoImgRef.current) {
				// Stop infinite repeat and set to just one repeat
				gsap.to(logoImgRef.current, {
					repeat: 1,
					onComplete: () => {
						// Trigger the timeline completion which will fade out the splash
						tl.progress(1);
					},
				});
				clearInterval(checkDataInterval);
			}
		}, 300);

		// Cleanup function
		return () => {
			tl.kill();
			clearInterval(checkDataInterval);
		};
	}, [showSplash, resetSplash]);

	if (!showSplash) return null;

	return (
		<div ref={containerRef} className="splash-screen">
			<figure className="splash-screen__logo">
				<img
					src="/newsify_logo_1.svg"
					alt="Newsify Logo"
					className="splash-screen__logo-image"
					ref={logoImgRef}
				/>
				<figcaption ref={textRef} className="splash-screen__logo-text">
					Newsify
				</figcaption>
			</figure>
		</div>
	);
}
