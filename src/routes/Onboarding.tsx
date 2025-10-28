import { useNavigate, useParams } from "react-router";
import { useSettings } from "../context/settingsContext";

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
	const { settings, updateSettings } = useSettings();
	const { id } = useParams();
	const navigate = useNavigate();

	const handleCompleteOnboarding = () => {
		updateSettings({ ...settings, showOnboarding: false });
		navigate("/"); // Navigate to home or wherever you want after onboarding
	};

	const continueOnboarding = (idx: number) => {
		if (idx === onboarding.length - 1) {
			handleCompleteOnboarding();
			return;
		}
		navigate(`/onboarding/${idx + 1}`);
	};

	// type guard to handle undefined id
	if (!id || !onboarding[Number(id)]) {
		throw new Error("Invalid onboarding step");
	}

	const idx = Number(id);

	return (
		<div className="onboarding-container">
			<figure>
				<img
					src={`/assets/onboarding-image/${id}.png`}
					alt="Onboarding Illustration"
					className="onboarding-image"
				/>
			</figure>
			<article className="onboarding-content">
				<h1>{onboarding[idx].title}</h1>
				<p>{onboarding[idx].description}</p>

				{/* stepper component for showing the current step */}
				<div className="button-group">
					<button
                        type="button"
                        data-outline="true"
                        onClick={handleCompleteOnboarding}
                    >
						Skip
					</button>
					<button
						type="button"
                        data-default="true"
						onClick={() => continueOnboarding(idx)}
					>
						Continue
					</button>
				</div>
			</article>
		</div>
	);
}
