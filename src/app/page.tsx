
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateIdea, type GenerateIdeaInput } from "@/ai/flows/generate-idea";
import { Loader2, Save, Sparkles, Wand2, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIdeas } from "@/contexts/IdeasContext";
import IdeaCard from "@/components/ideas/IdeaCard";
import Image from 'next/image';

export default function HomePage() {
  const [theme, setTheme] = useState("");
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addIdea: saveIdeaToContext, ideas: savedIdeas } = useIdeas();

  const handleGenerateIdeas = async () => {
    if (!theme.trim()) {
      toast({
        title: "Indata saknas",
        description: "Vänligen ange ett tema eller en problemformulering.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setGeneratedIdeas([]);
    try {
      const input: GenerateIdeaInput = { theme };
      const result = await generateIdea(input);
      if (result.ideas && result.ideas.length > 0) {
        setGeneratedIdeas(result.ideas);
        toast({
          title: "Idéer genererade!",
          description: `${result.ideas.length} nya idéer har skapats.`,
        });
      } else {
        setGeneratedIdeas(["Kunde inte generera några idéer för detta tema. Försök igen med en annan formulering."]);
        toast({
          title: "Inga idéer",
          description: "AI:n kunde inte generera idéer för det angivna temat.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error generating ideas:", error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte generera idéer. Försök igen senare.",
        variant: "destructive",
      });
      setGeneratedIdeas(["Ett fel uppstod vid generering av idéer."]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveIdea = (ideaContent: string) => {
    saveIdeaToContext(ideaContent);
    toast({
      title: "Idé sparad!",
      description: "Din idé har lagts till i 'Mina Idéer'.",
    });
  };

  const isIdeaSaved = (ideaContent: string) => {
    return savedIdeas.some(savedIdea => savedIdea.content === ideaContent);
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-10 bg-card rounded-lg shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-4 flex items-center justify-center gap-3">
            <Wand2 className="h-8 w-8" /> Utvecklingsportalen
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generera innovativa idéer för dina projekt. Ange ett tema eller en problemformulering och låt AI:n hjälpa dig!
          </p>
        </div>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" /> Generera Nya Idéer
          </CardTitle>
          <CardDescription>
            Ange ett tema, en problemformulering, eller en bransch för att få AI-genererade idéer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              type="text"
              placeholder="t.ex. 'Förbättra återvinning i städer' eller 'App för lokala bönder'"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="flex-grow text-base"
              aria-label="Tema eller problemformulering för idégenerering"
            />
            <Button onClick={handleGenerateIdeas} disabled={isLoading} className="w-full sm:w-auto text-base py-3 px-6">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generera Idéer
            </Button>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-md">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-semibold">Genererar idéer...</p>
              <p className="text-muted-foreground">Ett ögonblick, AI:n jobbar på din förfrågan.</p>
            </div>
          )}

          {!isLoading && generatedIdeas.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary">Genererade Idéer:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedIdeas.map((idea, index) => (
                  <IdeaCard
                    key={index}
                    idea={{ id: `generated-${index}`, content: idea, createdAt: new Date() }}
                    actionButton={
                      <Button 
                        size="sm" 
                        onClick={() => handleSaveIdea(idea)} 
                        disabled={isIdeaSaved(idea)}
                        variant={isIdeaSaved(idea) ? "secondary" : "default"}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isIdeaSaved(idea) ? "Sparad" : "Spara Idé"}
                      </Button>
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
       <section className="py-10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6 text-primary">Hur det fungerar</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg shadow-md">
              <Sparkles className="h-10 w-10 text-accent-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">1. Ange Tema</h3>
              <p className="text-muted-foreground">Skriv in ett ämne, problem eller en fråga du vill ha idéer kring.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md">
              <BrainCircuit className="h-10 w-10 text-accent-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">2. AI Genererar</h3>
              <p className="text-muted-foreground">Vår AI analyserar ditt tema och skapar unika, kreativa idéer.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md">
              <Save className="h-10 w-10 text-accent-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">3. Spara & Utveckla</h3>
              <p className="text-muted-foreground">Spara dina favoritidéer och börja utveckla dem vidare.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
