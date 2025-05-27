
"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

interface WorkshopProgressNavigatorProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
  onFinalSubmit?: () => void; // For the last step
}

export default function WorkshopProgressNavigator({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isNextDisabled = false,
  isSubmitting = false,
  onFinalSubmit,
}: WorkshopProgressNavigatorProps) {
  const progressPercentage = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const isFirstStep = currentStep === 0;
  const isLastStepBeforeReview = currentStep === totalSteps - 2; // Second to last step (actual questions)
  const isReviewStep = currentStep === totalSteps - 1; // The "Granska och Skicka" step

  return (
    <div className="mt-8 space-y-6">
      <div>
        <Progress value={progressPercentage} className="w-full h-2" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Steg {currentStep + 1} av {totalSteps}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep || isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Föregående fråga
        </Button>

        {isReviewStep && onFinalSubmit ? (
           <Button onClick={onFinalSubmit} disabled={isSubmitting} size="lg">
            {isSubmitting ? "Skickar..." : "Skicka in Workshop"} 
            <Send className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={onNext} 
            disabled={isNextDisabled || isSubmitting || currentStep >= totalSteps -1 /* Disable on review step if not final submit */}
          >
            {isLastStepBeforeReview ? "Gå till Granskning" : "Nästa fråga"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
