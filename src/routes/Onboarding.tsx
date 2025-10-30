import { useState } from "react";
import { useNavigate } from "react-router";
import { Stepper } from "../components/stepper";
import { useSettings } from "../context/settingsContext";
import { useTheme } from "../hooks/useTheme";

const onboarding = [
	{
		title: "Stay Connected, Everywhere, Anytime",
		description:
			"Welcome to Newsify, your ultimate destination for breaking news, exclusive stories, and tailored content.",
	},
	{
		title: "Become a Savvy Global Citizen.",
		description:
			"Discover tailored news that aligns with your interests and preferences. Your personalized news journey awaits!",
	},
	{
		title: "Enhance your News Journey Now!",
		description:
			"Be part of our dynamic community and contribute your insights and participate in enriching conversations.",
	},
];

export default function Onboarding() {
	const [currentStep, setCurrentStep] = useState(0);

	const { settings, updateSettings } = useSettings();
	const { theme } = useTheme();
	const navigate = useNavigate();

	const completeOnboarding = () => {
		updateSettings({ ...settings, showOnboarding: false });
		navigate("/login");
	};

	const handleContinue = () => {
		if (currentStep === onboarding.length - 1) {
			completeOnboarding();
		} else {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleSkip = () => {
		completeOnboarding();
	};

	return (
		<div className="onboarding-container">
			<figure>
				<img
					src={`/assets/onboarding-image-${theme}-${currentStep}.svg`}
					alt="Onboarding Illustration"
					className="onboarding-image"
				/>
			</figure>
			<article className="onboarding-content">
				<h1>{onboarding[currentStep].title}</h1>
				<p>{onboarding[currentStep].description}</p>

				{/* stepper component for showing the current step */}
				<Stepper
					totalSteps={onboarding.length}
					currentStep={currentStep}
				/>

				<div className="button-group">
					<button
						type="button"
						data-outline="true"
						onClick={handleSkip}
					>
						Skip
					</button>
					<button
						type="button"
						data-default="true"
						onClick={handleContinue}
					>
						Continue
					</button>
				</div>
			</article>
		</div>
	);
}
