import { DeploymentStep } from "../../domain/types/game.types";

interface DeploymentProgressProps {
  currentStep: DeploymentStep;
  message: string;
}

const DEPLOYMENT_STEPS: { step: DeploymentStep; label: string }[] = [
  { step: "deploying-hasher", label: "Deploy Hasher" },
  { step: "waiting-hasher", label: "Confirm Hasher" },
  { step: "generating-commitment", label: "Generate Hash" },
  { step: "deploying-rps", label: "Deploy Game" },
  { step: "waiting-rps", label: "Confirm Game" },
  { step: "storing-data", label: "Store Data" },
  { step: "completed", label: "Complete" },
];

export function DeploymentProgress({ currentStep, message }: DeploymentProgressProps) {
  const getCurrentStepIndex = () => {
    const index = DEPLOYMENT_STEPS.findIndex((s) => s.step === currentStep);
    return index;
  };

  const isStepCompleted = (stepIndex: number) => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex > stepIndex || currentStep === "completed";
  };

  const isStepActive = (stepIndex: number) => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex === stepIndex && currentStep !== "completed";
  };

  if (currentStep === "idle") return null;

  return (
    <div className="w-full space-y-3 rounded-lg border border-white/10 bg-black/20 px-8 py-10">
      {/* Progress Message */}
      <div className="mb-4 text-center">
        <p className="text-sm text-white/70">{message}</p>
      </div>

      {/* Progress Bar */}
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/20" />

        {/* Progress Line */}
        <div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-green-500 transition-all duration-500"
          style={{
            width: `${(getCurrentStepIndex() / (DEPLOYMENT_STEPS.length - 1)) * 100}%`,
          }}
        />

        {/* Step Dots */}
        {DEPLOYMENT_STEPS.map((step, index) => (
          <div key={step.step} className="relative z-10 flex flex-col items-center gap-2">
            {/* Circle */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-black transition-all ${
                isStepCompleted(index)
                  ? "border-green-500 bg-green-500"
                  : isStepActive(index)
                    ? "border-green-500 bg-black"
                    : "border-white/30 bg-black"
              }`}
            >
              {isStepCompleted(index) ? (
                index === DEPLOYMENT_STEPS.length - 1 && currentStep === "completed" ? (
                  <span className="text-2xl">🎉</span>
                ) : (
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )
              ) : (
                <span
                  className={`text-sm font-semibold ${
                    isStepActive(index) ? "text-green-500" : "text-white/40"
                  }`}
                >
                  {index + 1}
                </span>
              )}
            </div>

            {/* Label - only show for active or completed */}
            {(isStepActive(index) || isStepCompleted(index)) && (
              <span className="absolute -bottom-6 whitespace-nowrap text-xs text-white/60">
                {step.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
