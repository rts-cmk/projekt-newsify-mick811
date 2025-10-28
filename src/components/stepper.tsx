type StepperProps = {
	totalSteps: number;
	currentStep: number;
};

export function Stepper({ totalSteps, currentStep }: StepperProps) {
	return (
		<ol className="stepper">
			{(() => {
				const steps = Array.from({ length: totalSteps }, (_, i) => ({
					id: `step-${i + 1}`,
					index: i,
				}));
				return steps.map((step) => (
					<li
						key={step.id}
						className={`stepper__dot ${step.index === currentStep ? "stepper__dot--current" : ""}`}
						aria-current={
							step.index === currentStep ? "step" : undefined
						}
					/>
				));
			})()}
		</ol>
	);
}
