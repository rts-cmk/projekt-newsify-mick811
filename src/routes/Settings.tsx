import { Footer, Header } from "../components/layout";
import { useSettings } from "../context/settingsContext";

export default function Settings() {
	const { settings, updateSettings } = useSettings();

	const handleCategoryChange = (category: string) => {
		const updatedCategories = {
			...settings.categories,
			[category]: !settings.categories[category],
		};

		updateSettings({ ...settings, categories: updatedCategories });
	};

	return (
		<div>
			<Header search={false} />
			<header>
				<h2>Settings</h2>
				<span>Categories</span>
			</header>

			<ul>
				{Object.entries(settings.categories).map(
					([category, state]) => {
						return (
							<li key={category}>
								<input
									type="checkbox"
									checked={state}
									onChange={() =>
										handleCategoryChange(category)
									}
								/>
								{category}
							</li>
						);
					},
				)}
			</ul>

			<button
				type="button"
				onClick={() =>
					updateSettings({
						...settings,
						theme: settings.theme === "light" ? "dark" : "light",
					})
				}
			>
				Toggle {settings.theme === "light" ? "Light" : "Dark"} Mode
			</button>

			<p>Version 4.8.15.16.23.42</p>
			<Footer />
		</div>
	);
}
