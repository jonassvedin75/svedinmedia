
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StartBrandWorkshopSchema, type StartBrandWorkshopFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { saveWorkshopStep1Data } from "@/actions/workshopActions";
import { useAuth } from "@/contexts/AuthContext";
import { Building, PlayCircle, Loader2 } from "lucide-react";

export default function VarumarkesWorkshopPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth(); // Get current user
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StartBrandWorkshopFormData>({
    resolver: zodResolver(StartBrandWorkshopSchema),
    defaultValues: {
      companyName: "",
    },
  });

  const onSubmit = async (data: StartBrandWorkshopFormData) => {
    if (!user) {
      toast({
        title: "Autentisering krävs",
        description: "Du måste vara inloggad för att starta en workshop.",
        variant: "destructive",
      });
      router.push("/login?redirect=/workshops/varumarke");
      return;
    }

    setIsLoading(true);
    try {
      const result = await saveWorkshopStep1Data({ 
        companyName: data.companyName,
        userId: user.uid // Pass the user ID
      });

      if (result.success && result.docId) {
        toast({
          title: "Workshop Startad!",
          description: `Varumärkesworkshopen för ${data.companyName} har påbörjats.`,
        });
        router.push(`/workshops/varumarke-formular/${result.docId}`);
      } else {
        toast({
          title: "Fel vid start av workshop",
          description: result.error || "Ett okänt fel uppstod.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to start workshop:", error);
      toast({
        title: "Något gick fel",
        description: "Kunde inte starta workshopen. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="text-center">
        <Building className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">
          Workshop: Varumärke
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Definiera och stärk ditt varumärke genom en guidad process. Börja med att ange ditt företagsnamn.
        </p>
      </section>

      <Card className="w-full max-w-lg mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Starta din Varumärkesworkshop</CardTitle>
          <CardDescription>Ange ditt företagsnamn för att initiera en ny workshop-session.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Företagsnamn</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Mitt Fantastiska Företag AB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <PlayCircle className="mr-2 h-5 w-5" />
                )}
                Starta Workshop
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
