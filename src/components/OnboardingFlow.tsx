import React from "react";

type OnboardingFlowProps = {
  children: React.ReactNode;
  currentIndex: number;
  onNext: (data: any) => void;
  onFinish: (data: any) => void;
  onPrevious: () => void;
  data: any;
};

export default function OnboardingFlow({
  children,
  onNext,
  onFinish,
  onPrevious,
  currentIndex,
  data,
}: OnboardingFlowProps) {
  const currentChild = React.Children.toArray(children)[currentIndex];
  const goToNext = (stepData) => {
    onNext(stepData);
  };

  const goToPrevious = () => {
    onPrevious();
  };

  if (React.isValidElement(currentChild)) {
    // @ts-ignore
    return React.cloneElement(currentChild, {
      goToPrevious: currentIndex !== 0 ? goToPrevious : undefined,
      goToNext: currentIndex !== children.length - 1 ? goToNext : undefined,
      onFinish: currentIndex === children.length - 1 ? onFinish : undefined,
      data,
    });
  }

  return currentChild;
}
