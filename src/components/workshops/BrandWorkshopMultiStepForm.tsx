
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
  initialWorkshopData?: any; 
}

export default function BrandWorkshopMultiStepForm({
  workshopSessionId,
  initialWorkshopData, 
}: BrandWorkshopMultiStepFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [allAnswers, setAllAnswers] = useState<Record<string, WorkshopStepAnswers>>({});
  
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const currentStepConfig = brandWorkshopSteps[currentStepIndex];

  const currentStepSchema = z.object(
    currentStepConfig.questions.reduce((schema, question) => {
      schema[question.id] = z.string().optional(); 
      return schema;
    }, {} as Record<string, z.ZodOptional<z.ZodString>>) 
  );

  const form = useForm<WorkshopStepAnswers>({
    resolver: zodResolver(currentStepSchema),
    defaultValues: allAnswers[currentStepConfig.stepIdentifier] || {},
  });
  
  const watchedFields = useWatch({ control: form.control });

  useEffect(() => {
    form.reset(allAnswers[currentStepConfig.stepIdentifier] || {});
  }, [currentStepIndex, form, currentStepConfig.stepIdentifier]); 
  
  useEffect(() => {
    if (currentStepConfig.stepIdentifier === 'review_submit') return;

    const processSave = async () => {
      const currentRawData = form.getValues();
      if (!user || !workshopSessionId) return;
      
      setAllAnswers(prev => {
        const existingStepData = prev[currentStepConfig.stepIdentifier];
        if (JSON.stringify(existingStepData) === JSON.stringify(currentRawData)) {
          return prev; 
        }
        return {
          ...prev,
          [currentStepConfig.stepIdentifier]: currentRawData,
        };
      });

      const answersToSave = Object.entries(currentRawData).reduce((acc, [key, value]) => {
        if (typeof value === 'string' && value.trim() !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as WorkshopStepAnswers);

      if (Object.keys(answersToSave).length > 0) {
        try {
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
              // Consider a less intrusive way to show autosave errors
              // toast({ title: "Autosave Error", description: response.error, variant: "destructive", duration: 2000 });
            }
          });
        } catch (error) {
          // console.error("Autosave exception:", error);
        }
      }
    };

    const debouncedSave = setTimeout(() => {
        processSave();
    }, 1500); 

    return () => clearTimeout(debouncedSave);
  }, [JSON.stringify(watchedFields), workshopSessionId, currentStepIndex, user, toast, form, currentStepConfig.stepIdentifier]);


  const handleNext = async () => {
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
     setAllAnswers(prev => ({ // Ensure allAnswers is up-to-date before potentially navigating
      ...prev,
      [currentStepConfig.stepIdentifier]: currentAnswers,
    }));

    // Filter for actual answers to save
    const answersToSave = Object.entries(currentAnswers).reduce((acc, [key, value]) => {
        if (typeof value === 'string' && value.trim() !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as WorkshopStepAnswers);

    if (user && workshopSessionId && Object.keys(answersToSave).length > 0) {
      setIsLoading(true);
      const result = await saveWorkshopStepAnswers({
        workshopSessionId,
        stepIdentifier: currentStepConfig.stepIdentifier,
        stepAnswers: answersToSave, // Save only trimmed, non-empty answers
        userId: user.uid,
      });
      setIsLoading(false);
      if (!result.success) {
        toast({
          title: "Kunde inte spara svar",
          description: result.error || "Ett fel uppstod.",
          variant: "destructive",
        });
        return; 
      }
    }
    
    if (currentStepIndex < brandWorkshopSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const currentAnswers = form.getValues();
      setAllAnswers(prev => ({
        ...prev,
        [currentStepConfig.stepIdentifier]: currentAnswers,
      }));
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (!user) {
      toast({ title: "Autentisering krävs", variant: "destructive" });
      return;
    }
    setIsSubmittingFinal(true);
    const result = await markWorkshopAsCompleted({ workshopSessionId, userId: user.uid });
    setIsSubmittingFinal(false);

    if (result.success) {
      toast({
        title: "Workshop Inskickad!",
        description: "Dina svar har sparats och workshopen är markerad som slutförd.",
        variant: "default", // Keep default, custom styling in globals.css if needed
        duration: 5000,
      });
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
                <Alert variant="default" className="bg-accent border-primary/30">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <AlertTitle className="text-primary font-semibold">Redo att skicka in!</AlertTitle>
                    <AlertDescription className="text-accent-foreground">
                        Tack för dina svar! Granska gärna dina svar genom att klicka 'Föregående fråga' innan du skickar in.
                        Dina svar sparas automatiskt när du navigerar mellan stegen.
                    </AlertDescription>
                </Alert>
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
