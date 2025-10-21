import { useEffect, useState } from "react";

type ColorScheme = "light" | "dark";

export function useColorScheme(): ColorScheme {
	const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");

	useEffect(() => {
		const savedPreference = localStorage.getItem(
			"color-scheme",
		) as ColorScheme | null;

		const detectSystemPreference = (): ColorScheme => {
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		};

		if (savedPreference) {
			setColorScheme(savedPreference);
		} else {
			setColorScheme(detectSystemPreference());
		}

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem("color-scheme")) {
				setColorScheme(e.matches ? "dark" : "light");
			}
		};

		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	return colorScheme;
}
