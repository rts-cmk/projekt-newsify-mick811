type StepperProps = {
	totalSteps: number;
	currentStep: number;
};

export const Stepper = ({ totalSteps, currentStep }: StepperProps) => {
	return (
		<div
			className="stepper"
			role="progressbar"
			aria-valuenow={currentStep + 1}
			aria-valuemin={1}
			aria-valuemax={totalSteps}
			aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
		>
			{Array.from({ length: totalSteps }, (_, idx) => idx).map((step) => (
				<span
					key={`step-${step}`}
					className={`stepper__dot ${step === currentStep ? "stepper__dot--active" : ""}`}
				/>
			))}
		</div>
	);
};
