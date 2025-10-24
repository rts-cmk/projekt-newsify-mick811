import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { Stepper } from "@/components/ui/stepper";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { authQueryOptions } from "@/lib/queries";

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

export const Route = createFileRoute("/(auth-pages)/onboarding")({
	ssr: false,
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData({
			...authQueryOptions(),
			revalidateIfStale: true,
		});
		if (user) {
			throw redirect({ to: "/" });
		}
	},
});

function RouteComponent() {
	const [currentStep, setCurrentStep] = useState(0);
	const { colorScheme } = useColorScheme();
	const navigate = useNavigate();

	const completeOnboarding = () => {
		localStorage.setItem("onboarding_completed", "true");
		navigate({ to: "/login" });
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
		<article className="onboarding">
			<figure className="onboarding__image">
				<img
					src={`/onboarding/newsify_onboarding_${colorScheme}_${currentStep + 1}.png`}
					alt={`Onboarding step ${currentStep + 1}`}
					width={200}
					height={200}
				/>
			</figure>
			<figcaption className="onboarding__title">
				<h2 className="onboarding__title-text bold">
					{onboarding[currentStep]?.title}
				</h2>
				<p className="onboarding__title-description regular">
					{onboarding[currentStep]?.description}
				</p>
			</figcaption>

			<footer className="onboarding__footer">
				<Stepper totalSteps={onboarding.length} currentStep={currentStep} />
				<div className="onboarding__footer-buttons">
					<button
						type="button"
						className="onboarding__footer-button-skip semibold"
						onClick={handleSkip}
					>
						<Link to="/login" className="onboarding__footer-button-skip__link">
							Skip
						</Link>
					</button>
					<button
						type="button"
						className="onboarding__footer-button-continue semibold"
						onClick={handleContinue}
					>
						Continue
					</button>
				</div>
			</footer>
		</article>
	);
}
