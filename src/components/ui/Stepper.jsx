import React from 'react';
import { Check } from 'lucide-react';

export const Stepper = ({ steps = [], currentStep = 0, className = '' }) => {
  return (
    <div className={`w-full flex items-center justify-between relative ${className}`}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCompleted = index < currentStep || (index === currentStep && isLast);
        const isCurrent = index === currentStep && !isLast;

        return (
          <React.Fragment key={step.id || index}>
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 z-10 shrink-0">
              <div
                className={`
                  w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all duration-250 ease-out
                  ${
                    isCompleted
                      ? 'bg-success-600 text-white shadow-sm ring-2 ring-success-50'
                      : isCurrent
                        ? 'bg-neutral-0 border-2 border-primary-600 text-primary-600 shadow-sm ring-4 ring-primary-50'
                        : 'bg-neutral-200 text-neutral-500'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium text-center transition-colors max-w-[65px] xs:max-w-[80px] sm:max-w-[120px] truncate ${
                  isCurrent
                    ? 'text-primary-600 font-semibold'
                    : isCompleted
                      ? 'text-neutral-700'
                      : 'text-neutral-400'
                }`}
              >
                {step.title || step.label || step}
              </span>
            </div>

            {!isLast && (
              <div className="flex-1 h-0.5 mx-1 sm:mx-2 mb-5 sm:mb-6 transition-all duration-250">
                <div
                  className={`h-full ${
                    index < currentStep ? 'bg-success-600' : 'bg-neutral-200'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
