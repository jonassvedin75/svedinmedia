
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FileText, Loader2, AlertCircle, Brain, Inbox } from "lucide-react";
import { getUserCreativeHourSubmissions, getCreativeHourMissions } from '@/actions/creativeHourActions';
import type { UserCreativeHourSubmission, CreativeHourMission } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MinaDokumentPage() {
  const [submissions, setSubmissions] = useState<UserCreativeHourSubmission[]>([]);
  const [missions, setMissions] = useState<CreativeHourMission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setIsLoading(false);
        setError("Du måste vara inloggad för att se dina dokument.");
        return;
      }
      setIsLoading(true);
      setError(null);
      
      const [submissionsResponse, missionsResponse] = await Promise.all([
        getUserCreativeHourSubmissions(),
        getCreativeHourMissions()
      ]);

      if (submissionsResponse.success && submissionsResponse.data) {
        setSubmissions(submissionsResponse.data as UserCreativeHourSubmission[]);
      } else {
        setError(submissionsResponse.error || "Kunde inte hämta sparade svar.");
        toast({ title: "Fel", description: submissionsResponse.error, variant: "destructive" });
      }

      if (missionsResponse.success && missionsResponse.data) {
        setMissions(missionsResponse.data);
      } else {
        // Non-critical if missions don't load, titles might just be missing
        toast({ title: "Info", description: `Kunde inte ladda uppdragsdetaljer: ${missionsResponse.error}`, variant: "default" });
      }
      
      setIsLoading(false);
    }
    fetchData();
  }, [user, toast]);

  const getMissionTitle = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    return mission ? mission.title : "Okänt uppdrag";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Laddar dina dokument...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ett fel uppstod</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <section className="text-center">
        <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">
          Mina Dokument
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Här samlas dina svar från Kreativa Timmen och framtida dokument.
        </p>
      </section>

      {submissions.length === 0 ? (
        <Alert className="max-w-lg mx-auto shadow-md">
            <Inbox className="h-4 w-4"/>
            <AlertTitle>Inga dokument ännu</AlertTitle>
            <AlertDescription>
                Du har inte sparat några svar från <Button variant="link" asChild className="p-0 h-auto"><Link href="/kreativa-timmen">Kreativa Timmen</Link></Button> än.
                <br/>
                Framtida funktioner kommer att visa sparade workshop-resultat och länkar till dina Google Drive-mappar här.
            </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
                <Brain className="h-6 w-6" /> Svar från Kreativa Timmen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {submissions.map(submission => (
                <Card key={submission.id} className="shadow-lg">
                <CardHeader>
                    <CardTitle>{getMissionTitle(submission.missionId)}</CardTitle>
                    <CardDescription>
                    Inskickat: {submission.submittedAt?.seconds ? format(new Date(submission.submittedAt.seconds * 1000), 'PPPp', { locale: sv }) : 'Okänt datum'}
                    {submission.companyNameForSession && ` | Företag: ${submission.companyNameForSession}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap text-sm">{submission.responseText}</p>
                </CardContent>
                {/* <CardFooter>
                    <Button variant="outline" size="sm">Visa Detaljer (framtida)</Button>
                </CardFooter> */}
                </Card>
            ))}
            </div>
        </div>
      )}
      
      {/* Placeholder for future sections like Drive links or workshop summaries */}
      <Card className="mt-10 border-dashed">
        <CardHeader>
            <CardTitle className="text-muted-foreground">Framtida Dokument</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-center">
                Här kommer du även kunna se sammanfattningar från dina slutförda workshops och direktlänkar till dina relevanta Google Drive-mappar.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}

    