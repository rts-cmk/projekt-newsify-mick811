export const Header = ({ showSearch = false }: { showSearch?: boolean }) => {
	return (
		<header className="header">
			<figure className="header__logo">
				<img src="/newsify_logo_1.svg" alt="Newsify" />
				<figcaption className="header__logo-text">Newsify</figcaption>
			</figure>

			{showSearch && (
				<nav className="header__search">
					<input type="text" placeholder="Search news" />
				</nav>
			)}
		</header>
	);
};
