import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

export type UserSettings = {
	theme: "light" | "dark";
	showOnboarding: boolean;
	archive: Record<string, any>;
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

export const SettingsContext = createContext({
	settings: defaultSettings,
	updateSettings: (_values: UserSettings) => {},
	addToArchive: (_item: any) => {},
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
	}, []);

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
		const { [uri]: removed, ...updatedArchive } = currentSettings.archive;
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
