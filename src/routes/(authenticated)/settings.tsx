import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
	type Category,
	DEFAULT_CATEGORIES,
	isCategoryEnabled,
	toggleCategory,
} from "@/lib/feed-categories";

export const Route = createFileRoute("/(authenticated)/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	const [enabledCategories, setEnabledCategories] = useState<Set<Category>>(
		new Set(),
	);
	const { toggleColorScheme, colorScheme } = useColorScheme();

	useEffect(() => {
		// Initialize enabled categories
		const enabled = new Set<Category>();
		for (const category of DEFAULT_CATEGORIES) {
			if (isCategoryEnabled(category)) {
				enabled.add(category);
			}
		}
		setEnabledCategories(enabled);
	}, []);

	const handleToggleCategory = (category: Category) => {
		toggleCategory(category);
		setEnabledCategories((prev) => {
			const updated = new Set(prev);
			if (updated.has(category)) {
				updated.delete(category);
			} else {
				updated.add(category);
			}
			return updated;
		});
	};

	return (
		<div className="authenticated-page">
			<Header />
			<div className="authenticated-page__content">
				<div className="settings">
					<h1 className="settings__title">Settings</h1>

					<section className="settings__section">
						<h2 className="settings__section-title">Categories</h2>

						<div className="settings__category-list">
							{DEFAULT_CATEGORIES.map((category) => (
								<div key={category} className="settings__category-item">
									<div className="settings__category-info">
										<img
											src="/newsify_logo_1.svg"
											alt=""
											className="settings__category-icon"
										/>
										<span className="settings__category-name">
											{category.toUpperCase()}
										</span>
									</div>
									<button
										type="button"
										onClick={() => handleToggleCategory(category)}
										className={`settings__toggle ${
											enabledCategories.has(category)
												? "settings__toggle--active"
												: ""
										}`}
										aria-label={`Toggle ${category}`}
										aria-pressed={enabledCategories.has(category)}
									>
										<span className="settings__toggle-thumb" />
									</button>
								</div>
							))}
						</div>
					</section>

					<button
						type="button"
						onClick={toggleColorScheme}
						className="settings__dark-mode-button"
					>
						Toggle {colorScheme === "light" ? "dark mode" : "light mode"}
					</button>

					<p className="settings__version">Version 4.8.15.16.23.42</p>
				</div>
			</div>
			<Footer />
		</div>
	);
}
