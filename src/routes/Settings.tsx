import { Footer, Header } from "../components/layout";
import { useSettings } from "../context/settingsContext";
import { useTheme } from "../hooks/useTheme";

const CategoryIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 78 113"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<g clipPath="url(#clip0_2022_7)">
			<path
				d="M15.8522 15.2054C24.5439 15.2054 31.6143 22.3104 31.6143 31.0445V97.1157C31.6143 105.85 24.5439 112.955 15.8522 112.955C7.16053 112.955 0.0900879 105.85 0.0900879 97.1157V31.0445C0.0900879 22.3104 7.16053 15.2054 15.8522 15.2054Z"
				fill="url(#paint0_linear_2022_7)"
			/>
			<path
				d="M62.238 0C70.9296 0 78.0001 7.10493 78.0001 15.839V67.8815C78.0001 76.6155 70.9296 83.7205 62.238 83.7205C53.5463 83.7205 46.4758 76.6155 46.4758 67.8815V15.839C46.4758 7.10493 53.5463 0 62.238 0Z"
				fill="url(#paint1_linear_2022_7)"
			/>
			<path
				d="M77.8651 69.3749C77.1896 72.9953 69.7138 77.0681 66.3813 70.9588C63.6342 65.8903 56.0233 54.2147 53.5014 50.3228L30.2635 8.14584C26.0302 0.497863 16.4379 -2.26265 8.827 1.99125C-1.57601 8.14584 0.0902747 16.9252 0.0902747 40.0049C0.765794 36.3845 8.82699 34.5291 12.1596 40.6384C15.4921 46.7478 47.9171 105.488 47.9171 105.488C52.1503 113.136 64.5799 114.086 69.5337 111.869C74.1272 109.832 76.9194 104.9 77.3697 99.65C78.5406 93.4955 77.6399 84.0826 77.8651 69.3749Z"
				fill="url(#paint2_linear_2022_7)"
			/>
		</g>
		<defs>
			<linearGradient
				id="paint0_linear_2022_7"
				x1="15.8661"
				y1="15.2008"
				x2="15.8661"
				y2="112.95"
				gradientUnits="userSpaceOnUse"
			>
				<stop offset="0.165" stopColor="#5F5001" />
				<stop offset="1" stopColor="#FDD201" />
			</linearGradient>
			<linearGradient
				id="paint1_linear_2022_7"
				x1="62.2518"
				y1="0"
				x2="62.2518"
				y2="83.7205"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#4F8620" />
				<stop offset="1" stopColor="#25430C" />
			</linearGradient>
			<linearGradient
				id="paint2_linear_2022_7"
				x1="9.51459"
				y1="6.52447"
				x2="70.6087"
				y2="105.406"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#FFD403" />
				<stop offset="1" stopColor="#2F5B0B" />
			</linearGradient>
			<clipPath id="clip0_2022_7">
				<rect width="78" height="113" fill="white" />
			</clipPath>
		</defs>
	</svg>
);

export default function Settings() {
	const { settings, updateSettings } = useSettings();
	const { theme, toggleTheme } = useTheme();

	const handleCategoryChange = (category: string) => {
		const updatedCategories = {
			...settings.categories,
			[category]: !settings.categories[category],
		};

		updateSettings({ ...settings, categories: updatedCategories });
	};

	return (
		<>
			<Header search={false} />

			<main className="settings-container">
				<header className="settings-header">
					<h2>Settings</h2>
					<span>Categories</span>
				</header>

				<div className="settings-list">
					{Object.entries(settings.categories).map(
						([category, isEnabled]) => (
							<div key={category} className="settings-item">
								<div className="settings-item-content">
									<CategoryIcon />
									<span className="settings-item-label">
										{category}
									</span>
								</div>
								<label className="toggle-switch">
									<input
										type="checkbox"
										checked={isEnabled}
										onChange={() =>
											handleCategoryChange(category)
										}
									/>
									<span className="toggle-slider" />
								</label>
							</div>
						),
					)}
				</div>

				<button
					type="button"
					data-outline-secondary="true"
					className="theme-toggle-button"
					onClick={toggleTheme}
				>
					Toggle {theme === "light" ? "dark" : "light"} mode
				</button>

				<p className="settings-version">Version 4.8.15.16.23.42</p>
			</main>

			<Footer />
		</>
	);
}
