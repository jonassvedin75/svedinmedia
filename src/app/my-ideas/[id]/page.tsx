
"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useIdeas } from "@/contexts/IdeasContext";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CalendarDays, FileText, Share2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

function IdeaDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { getIdeaById } = useIdeas();
  const { toast } = useToast();
  const ideaId = typeof params.id === 'string' ? params.id : '';
  const idea = getIdeaById(ideaId);

  const handleExportPlaceholder = () => {
    toast({
      title: "Funktion ej implementerad",
      description: "Export av användarberättelser är inte tillgänglig ännu.",
    });
  };

  if (!idea) {
    return (
       <div className="text-center py-10">
        <Alert variant="destructive" className="max-w-md mx-auto shadow-md">
          <Info className="h-4 w-4" />
          <AlertTitle>Idé hittades inte</AlertTitle>
          <AlertDescription>
            Kunde inte hitta den valda idén. Den kan ha tagits bort eller så är länken felaktig.
            <br />
            <Button variant="link" asChild className="mt-2 p-0 h-auto">
                <Link href="/my-ideas">Tillbaka till Mina Idéer</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till Mina Idéer
      </Button>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold flex items-center gap-2">
             <FileText className="h-7 w-7 text-primary" /> Idédetaljer
          </CardTitle>
          {idea.createdAt && (
            <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" /> Sparad: {format(new Date(idea.createdAt), "PPPPp", { locale: sv })}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-lg whitespace-pre-wrap leading-relaxed">{idea.content}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleExportPlaceholder} variant="secondary">
            <Share2 className="mr-2 h-4 w-4" /> Exportera Användarberättelser (Platshållare)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function IdeaDetailPage() {
  return (
    <ProtectedRoute>
      <IdeaDetailContent />
    </ProtectedRoute>
  );
}
