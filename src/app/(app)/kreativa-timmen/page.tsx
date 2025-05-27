
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveCreativeHourSubmissionInputSchema, type SaveCreativeHourSubmissionFormData, type CreativeHourMission } from "@/types";
import { saveCreativeHourSubmission, getCreativeHourMissions } from "@/actions/creativeHourActions";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Lightbulb, AlertCircle, Send, FileQuestion } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function KreativaTimmenPage() {
  const [missions, setMissions] = useState<CreativeHourMission[]>([]);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMissions, setIsLoadingMissions] = useState(true);
  const [errorMissions, setErrorMissions] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<SaveCreativeHourSubmissionFormData>({
    resolver: zodResolver(SaveCreativeHourSubmissionInputSchema),
    defaultValues: {
      missionId: "",
      companyNameForSession: "",
      responseText: "",
    },
  });
  
  useEffect(() => {
    async function fetchMissions() {
      setIsLoadingMissions(true);
      setErrorMissions(null);
      const response = await getCreativeHourMissions();
      if (response.success && response.data) {
        setMissions(response.data);
        if (response.data.length > 0) {
          form.setValue("missionId", response.data[0].id); // Set initial missionId
        }
      } else {
        setErrorMissions(response.error || "Kunde inte ladda uppdrag.");
        toast({ title: "Fel vid laddning av uppdrag", description: response.error, variant: "destructive" });
      }
      setIsLoadingMissions(false);
    }
    fetchMissions();
  }, [form, toast]);

  const currentMission = missions[currentMissionIndex];

  useEffect(() => {
    if (currentMission) {
      form.setValue("missionId", currentMission.id);
      // Optionally reset responseText if navigating between missions this way
      // form.reset({ ...form.getValues(), missionId: currentMission.id, responseText: "" }); 
    }
  }, [currentMission, form]);


  const onSubmit = async (data: SaveCreativeHourSubmissionFormData) => {
    if (!user) {
      toast({ title: "Autentisering krävs", variant: "destructive" });
      return;
    }
    if (!currentMission) {
        toast({ title: "Inget uppdrag valt", description: "Välj ett uppdrag först.", variant: "destructive"});
        return;
    }

    setIsLoading(true);
    const result = await saveCreativeHourSubmission({ ...data, missionId: currentMission.id });
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Svar Sparat!",
        description: "Ditt svar för Kreativa Timmen har sparats.",
      });
      form.reset({ ...form.getValues(), responseText: "" }); // Clear response text
      // Optionally move to next mission or give choice
    } else {
      toast({
        title: "Fel vid Sparande",
        description: result.error || "Ett okänt fel uppstod.",
        variant: "destructive",
      });
    }
  };
  
  // Simple navigation for missions, can be improved
  const handleNextMission = () => {
    if (currentMissionIndex < missions.length - 1) {
      setCurrentMissionIndex(currentMissionIndex + 1);
    }
  };
  const handlePreviousMission = () => {
     if (currentMissionIndex > 0) {
      setCurrentMissionIndex(currentMissionIndex - 1);
    }
  };

  if (isLoadingMissions) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Laddar uppdrag för Kreativa Timmen...</p>
      </div>
    );
  }

  if (errorMissions) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Kunde inte ladda Kreativa Timmen</AlertTitle>
        <AlertDescription>{errorMissions}</AlertDescription>
      </Alert>
    );
  }
  
  if (missions.length === 0) {
    return (
      <Alert className="max-w-lg mx-auto">
        <FileQuestion className="h-4 w-4" />
        <AlertTitle>Inga uppdrag tillgängliga</AlertTitle>
        <AlertDescription>
          Det finns inga uppdrag för Kreativa Timmen just nu. En administratör behöver lägga till uppdrag.
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <div className="space-y-8">
      <section className="text-center">
        <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">
          Kreativa Timmen
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Få inspiration och nya perspektiv genom korta, kreativa uppdrag.
        </p>
      </section>

      {currentMission && (
        <Card className="w-full max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">{currentMission.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Kategori: {currentMission.category}</CardDescription>
            <p className="pt-2">{currentMission.taskDescription}</p>
            {currentMission.bonusTask && (
              <p className="pt-1 text-sm text-accent-foreground italic">Bonus: {currentMission.bonusTask}</p>
            )}
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyNameForSession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Företagsnamn (för kontext, valfritt)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Mitt Företag AB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="responseText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ditt svar på uppdraget</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Skriv dina tankar och idéer här..." {...field} rows={8} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <input type="hidden" {...form.register("missionId")} />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Spara Svar
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousMission} disabled={currentMissionIndex === 0}>
              Föregående uppdrag
            </Button>
            <Button variant="outline" onClick={handleNextMission} disabled={currentMissionIndex === missions.length - 1}>
              Nästa uppdrag
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {!currentMission && missions.length > 0 && (
         <Alert className="max-w-lg mx-auto">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Välj ett uppdrag</AlertTitle>
            <AlertDescription>Använd knapparna ovan för att bläddra mellan uppdragen.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

    