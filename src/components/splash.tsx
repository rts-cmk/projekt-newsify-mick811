import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";
import { useSplash } from "@/context/splash-context";

export function Splash() {
	const { showSplash, resetSplash } = useSplash();
	const containerRef = useRef<HTMLDivElement>(null);
	const logoImgRef = useRef<HTMLImageElement>(null);
	const textRef = useRef<HTMLElement>(null);

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
				gsap.to(containerRef.current, {
					opacity: 0,
					scale: 0.95,
					duration: 0.8,
					ease: "power2.inOut",
					delay: 0.5,
					onComplete: resetSplash,
				});
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
					repeat: 1,
					yoyo: true,
					duration: 1.2,
					ease: "sine.inOut",
				},
				"-=0.3",
			);

		// Cleanup function
		return () => {
			tl.kill();
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
