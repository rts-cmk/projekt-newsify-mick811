import { useEffect } from "react";
import { useSettings } from "../context/settingsContext";

export const useTheme = () => {
	const { settings, updateSettings } = useSettings();
	const theme = settings.theme;

	// Apply theme class to HTML and body elements
	useEffect(() => {
		const html = document.documentElement;
		const body = document.body;

		if (theme === "dark") {
			html.classList.remove("light");
			html.classList.add("dark");
			body.classList.remove("light");
			body.classList.add("dark");
		} else {
			html.classList.remove("dark");
			html.classList.add("light");
			body.classList.remove("dark");
			body.classList.add("light");
		}
	}, [theme]);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		updateSettings({
			...settings,
			theme: newTheme,
		});
	};

	const setTheme = (newTheme: "light" | "dark") => {
		updateSettings({
			...settings,
			theme: newTheme,
		});
	};

	return {
		theme,
		toggleTheme,
		setTheme,
	};
};
