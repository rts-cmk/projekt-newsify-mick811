import { createContext, useContext, useEffect, useState } from "react";

type SplashContextType = {
	showSplash: boolean;
	resetSplash: () => void;
};

const SplashContext = createContext<SplashContextType>({
	showSplash: false,
	resetSplash: () => {},
});

export const useSplash = () => {
	return useContext(SplashContext);
};

export const SplashProvider = ({ children }: { children: React.ReactNode }) => {
	const [showSplash, setShowSplash] = useState(false);

	useEffect(() => {
		const hasShown = sessionStorage.getItem("splash_shown");

		if (!hasShown) {
			setShowSplash(true);
		}
	}, []);

	const resetSplash = () => {
		sessionStorage.setItem("splash_shown", "true");
		setShowSplash(false);
	};

	return (
		<SplashContext.Provider value={{ showSplash, resetSplash }}>
			{children}
		</SplashContext.Provider>
	);
};
