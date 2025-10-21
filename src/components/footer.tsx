import { Link } from "@tanstack/react-router";

const footerItems = [
	{
		label: "Home",
		href: "/",
		icon: ``,
	},
	{
		label: "Archive",
		href: "/archive",
	},
	{
		label: "Popular",
		href: "/popular",
	},
	{
		label: "Settings",
		href: "/settings",
	},
];

export const Footer = () => {
	return (
		<footer className="footer">
			<nav className="footer__nav">
				{footerItems.map((item) => (
					<Link
						key={item.label}
						to={item.href}
						className="footer__nav-item"
						activeProps={{
							className: "footer__nav-item--active",
						}}
					>
						<img
							src={`/icons/${item.label.toLowerCase()}.svg`}
							alt={item.label}
							className="footer__nav-item-icon"
						/>
						<span className="footer__nav-item-label">{item.label}</span>
					</Link>
				))}
			</nav>
		</footer>
	);
};
