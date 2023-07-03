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
  const goToNext = (stepData: any) => {
    onNext(stepData);
  };

  const goToPrevious = () => {
    onPrevious();
  };

  if (React.isValidElement(currentChild)) {
    // @ts-ignore
    return React.cloneElement(currentChild, {
      //@ts-ignore
      goToPrevious: currentIndex !== 0 ? goToPrevious : undefined,
      //@ts-ignore
      goToNext: currentIndex !== children?.length - 1 ? goToNext : undefined,
      //@ts-ignore
      onFinish: currentIndex === children?.length - 1 ? onFinish : undefined,
      //@ts-ignore
      data,
    });
  }

  return currentChild;
}
