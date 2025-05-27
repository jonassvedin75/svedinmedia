
"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useIdeas } from "@/contexts/IdeasContext";
import IdeaCard from "@/components/ideas/IdeaCard";
import { ListChecks, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function MyIdeasContent() {
  const { ideas } = useIdeas();

  if (ideas.length === 0) {
    return (
       <div className="text-center py-10">
        <Alert className="max-w-md mx-auto shadow-md">
          <Info className="h-4 w-4" />
          <AlertTitle>Inga sparade idéer ännu!</AlertTitle>
          <AlertDescription>
            Du har inte sparat några idéer. Gå till <Button variant="link" asChild className="p-0 h-auto"><Link href="/">startsidan</Link></Button> för att generera och spara nya idéer.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Sort ideas by creation date, newest first
  const sortedIdeas = [...ideas].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <ListChecks className="h-7 w-7" /> Mina Sparade Idéer
        </h1>
        <Button asChild>
            <Link href="/">Generera Nya Idéer</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} showDetailsLink={true} />
        ))}
      </div>
    </div>
  );
}

export default function MyIdeasPage() {
  return (
    <ProtectedRoute>
      <MyIdeasContent />
    </ProtectedRoute>
  );
}
