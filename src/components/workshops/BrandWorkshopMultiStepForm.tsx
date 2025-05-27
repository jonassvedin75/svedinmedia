
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandWorkshopSteps } from "@/lib/workshopQuestions";
import type { WorkshopStepAnswers, ActionResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import WorkshopProgressNavigator from "./WorkshopProgressNavigator";
import { useToast } from "@/hooks/use-toast";
import { saveWorkshopStepAnswers, markWorkshopAsCompleted } from "@/actions/workshopActions";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface BrandWorkshopMultiStepFormProps {
  workshopSessionId: string;
  initialWorkshopData?: any; // Type this properly if fetching existing data
}

export default function BrandWorkshopMultiStepForm({
  workshopSessionId,
  initialWorkshopData, // TODO: Fetch and populate existing answers
}: BrandWorkshopMultiStepFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [allAnswers, setAllAnswers] = useState<Record<string, WorkshopStepAnswers>>({});
  
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const currentStepConfig = brandWorkshopSteps[currentStepIndex];

  // Create a dynamic Zod schema based on the current step's questions
  const currentStepSchema = z.object(
    currentStepConfig.questions.reduce((schema, question) => {
      schema[question.id] = z.string().optional(); // All textareas are optional strings for now
      return schema;
    }, {} as Record<string, z.ZodOptional<z.ZodString>>) 
  );

  const form = useForm<WorkshopStepAnswers>({
    resolver: zodResolver(currentStepSchema),
    defaultValues: allAnswers[currentStepConfig.stepIdentifier] || {},
  });
  
  // Watch all form fields to save on change
  const watchedFields = useWatch({ control: form.control });

  useEffect(() => {
    // Reset form with new default values when step changes or allAnswers are updated
    form.reset(allAnswers[currentStepConfig.stepIdentifier] || {});
  }, [currentStepIndex, allAnswers, form, currentStepConfig.stepIdentifier]);

  
  // Debounced save function
  useEffect(() => {
    if (currentStepConfig.stepIdentifier === 'review_submit') return; // Don't auto-save on review step

    const processSave = async (data: WorkshopStepAnswers) => {
      if (!user || !workshopSessionId || Object.keys(data).length === 0) return;
      
      // Filter out empty/undefined answers before saving
      const answersToSave = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value.trim() !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as WorkshopStepAnswers);

      if (Object.keys(answersToSave).length === 0) {
         // If all answers for the current step are empty, no need to call server
        // but update local state to reflect this (e.g. if user deleted text)
        setAllAnswers(prev => ({
            ...prev,
            [currentStepConfig.stepIdentifier]: {},
        }));
        return;
      }
      
      // Optimistically update UI state
      setAllAnswers(prev => ({
        ...prev,
        [currentStepConfig.stepIdentifier]: data, // Save current input, even if some are empty
      }));

      // console.log("Attempting to save:", currentStepConfig.stepIdentifier, answersToSave);

      try {
        // No need to await here if we don't want to block UI for autosave
        saveWorkshopStepAnswers({
          workshopSessionId,
          stepIdentifier: currentStepConfig.stepIdentifier,
          stepAnswers: answersToSave,
          userId: user.uid,
        }).then(response => {
          if (response.success) {
            // console.log(`Autosaved step ${currentStepConfig.stepIdentifier}`);
          } else {
            // console.error("Autosave failed:", response.error);
            // Optionally revert optimistic update or show a small, non-intrusive error
            // toast({ title: "Autosave Error", description: response.error, variant: "destructive", duration: 2000 });
          }
        });
      } catch (error) {
        // console.error("Autosave exception:", error);
      }
    };

    const debouncedSave = setTimeout(() => {
        processSave(form.getValues());
    }, 1500); // Save 1.5 seconds after last change

    return () => clearTimeout(debouncedSave);
  }, [watchedFields, workshopSessionId, currentStepIndex, user, toast, form, currentStepConfig.stepIdentifier]);


  const handleNext = async () => {
    // Validate current step before proceeding
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Valideringsfel",
        description: "Vänligen fyll i fälten korrekt.",
        variant: "destructive",
      });
      return;
    }

    const currentAnswers = form.getValues();
     setAllAnswers(prev => ({
      ...prev,
      [currentStepConfig.stepIdentifier]: currentAnswers,
    }));

    if (user && workshopSessionId && Object.keys(currentAnswers).length > 0) {
      setIsLoading(true);
      const result = await saveWorkshopStepAnswers({
        workshopSessionId,
        stepIdentifier: currentStepConfig.stepIdentifier,
        stepAnswers: currentAnswers,
        userId: user.uid,
      });
      setIsLoading(false);
      if (!result.success) {
        toast({
          title: "Kunde inte spara svar",
          description: result.error || "Ett fel uppstod.",
          variant: "destructive",
        });
        return; // Prevent moving to next step if save fails
      }
    }
    
    if (currentStepIndex < brandWorkshopSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      form.reset(allAnswers[brandWorkshopSteps[currentStepIndex + 1].stepIdentifier] || {});
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
       // Save current answers before going back
      const currentAnswers = form.getValues();
      setAllAnswers(prev => ({
        ...prev,
        [currentStepConfig.stepIdentifier]: currentAnswers,
      }));
      setCurrentStepIndex(currentStepIndex - 1);
      form.reset(allAnswers[brandWorkshopSteps[currentStepIndex - 1].stepIdentifier] || {});
    }
  };

  const handleFinalSubmit = async () => {
    if (!user) {
      toast({ title: "Autentisering krävs", variant: "destructive" });
      return;
    }
    setIsSubmittingFinal(true);
    // Optional: A final save of all answers or just mark as completed
    const result = await markWorkshopAsCompleted({ workshopSessionId, userId: user.uid });
    setIsSubmittingFinal(false);

    if (result.success) {
      toast({
        title: "Workshop Inskickad!",
        description: "Dina svar har sparats och workshopen är markerad som slutförd.",
        variant: "default",
        className: "bg-green-500 text-white",
        duration: 5000,
      });
      // Redirect to a summary page or dashboard
      router.push(`/workshops`); 
    } else {
      toast({
        title: "Kunde inte skicka in",
        description: result.error || "Ett fel uppstod.",
        variant: "destructive",
      });
    }
  };

  const isReviewStep = currentStepConfig.stepIdentifier === "review_submit";

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Åtkomst nekad</AlertTitle>
        <AlertDescription>Du måste vara inloggad för att komma åt denna workshop.</AlertDescription>
      </Alert>
    );
  }


  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-primary">{currentStepConfig.title}</CardTitle>
          <CardDescription>
            {isReviewStep 
              ? "Granska dina svar innan du skickar in. Du kan gå tillbaka med 'Föregående fråga'."
              : `Pass ${currentStepConfig.stepIdentifier.split('_')[0].replace('pass','')} - Fråga ${currentStepIndex + 1} av ${brandWorkshopSteps.length -1 } (exkl. granskning)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && currentStepIndex < brandWorkshopSteps.length -1 && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3">Sparar svar...</p>
            </div>
          )}
          {!isReviewStep ? (
            <Form {...form}>
              <form className="space-y-6">
                {currentStepConfig.questions.map((question) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={question.id as keyof WorkshopStepAnswers}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">{question.label}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={question.placeholder || "Ditt svar..."}
                            {...field}
                            rows={5}
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
                <Alert variant="default" className="bg-green-50 border-green-300">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-700">Redo att skicka in!</AlertTitle>
                    <AlertDescription className="text-green-600">
                        Tack för dina svar! Granska gärna dina svar genom att klicka 'Föregående fråga' innan du skickar in.
                        Dina svar sparas automatiskt när du navigerar mellan stegen.
                    </AlertDescription>
                </Alert>
                {/* Optionally display a summary of answers here */}
            </div>
          )}
        </CardContent>
      </Card>

      <WorkshopProgressNavigator
        currentStep={currentStepIndex}
        totalSteps={brandWorkshopSteps.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isNextDisabled={isLoading || (isReviewStep)}
        isSubmitting={isLoading || isSubmittingFinal}
        onFinalSubmit={isReviewStep ? handleFinalSubmit : undefined}
      />
    </div>
  );
}
