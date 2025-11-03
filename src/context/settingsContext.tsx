import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type UserSettings = {
	theme: "light" | "dark";
	showOnboarding: boolean;
	archive: Record<string, TopStoriesResult | MostPopularResult>;
	categories: Record<string, boolean>;
};

const defaultSettings: UserSettings = {
	theme: "light",
	showOnboarding: true,
	archive: {},
	categories: {
		europe: true,
		health: true,
		sports: true,
		business: true,
		travel: true,
	},
};

// Helper function to get settings from localStorage (can be used in loaders)
export const getSettings = (): UserSettings => {
	const rawSettings = localStorage.getItem("user_settings");
	if (!rawSettings) return defaultSettings;
	try {
		return {
			...defaultSettings,
			...(JSON.parse(rawSettings) as UserSettings),
		};
	} catch {
		return defaultSettings;
	}
};

export const SettingsContext = createContext({
	settings: defaultSettings,
	updateSettings: (_values: UserSettings) => {},
	addToArchive: (_item: TopStoriesResult | MostPopularResult) => {},
	removeFromArchive: (_uri: string) => {},
});

export const SettingsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const rawSettings = localStorage.getItem("user_settings");
	let settings: UserSettings | undefined;
	if (rawSettings) {
		try {
			settings = {
				...defaultSettings,
				...(JSON.parse(rawSettings) as UserSettings),
			};
		} catch (error) {
			console.warn(
				`failed parse settings with error ${error}\n\n with data`,
				rawSettings,
			);
		}
	}

	const [currentSettings, setCurrentSettings] = useState(
		settings || defaultSettings,
	);

	useEffect(() => {
		const theme = (settings || defaultSettings).theme;
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
	}, [settings]);

	const updateSettings = (values: UserSettings) => {
		window.localStorage.setItem("user_settings", JSON.stringify(values));
		setCurrentSettings(values);
	};

	const addToArchive = (item: TopStoriesResult | MostPopularResult) => {
		const updatedArchive = {
			...currentSettings.archive,
			[item.uri]: item,
		};
		const updatedSettings = {
			...currentSettings,
			archive: updatedArchive,
		};
		updateSettings(updatedSettings);
	};

	const removeFromArchive = (uri: string) => {
		const { [uri]: _removed, ...updatedArchive } = currentSettings.archive;
		const updatedSettings = {
			...currentSettings,
			archive: updatedArchive,
		};
		updateSettings(updatedSettings);
	};

	return (
		<SettingsContext.Provider
			value={{
				settings: currentSettings,
				updateSettings,
				addToArchive,
				removeFromArchive,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => useContext(SettingsContext);
