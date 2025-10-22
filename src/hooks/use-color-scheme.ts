import { useEffect, useState } from "react";

type ColorScheme = "light" | "dark";

export function useColorScheme() {
	const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
		if (typeof window === "undefined") return "light";

		const saved = localStorage.getItem("color-scheme") as ColorScheme | null;
		if (saved === "dark" || saved === "light") {
			return saved;
		}

		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	});

	useEffect(() => {
		// Apply the color scheme to the document
		document.documentElement.style.colorScheme = colorScheme;

		// Listen for system preference changes
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (e: MediaQueryListEvent) => {
			const saved = localStorage.getItem("color-scheme");
			if (!saved) {
				const newScheme = e.matches ? "dark" : "light";
				setColorScheme(newScheme);
				document.documentElement.style.colorScheme = newScheme;
			}
		};

		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, [colorScheme]);

	const toggleColorScheme = () => {
		const newScheme = colorScheme === "light" ? "dark" : "light";
		setColorScheme(newScheme);
		localStorage.setItem("color-scheme", newScheme);
		document.documentElement.style.colorScheme = newScheme;
	};

	return { colorScheme, toggleColorScheme };
}
