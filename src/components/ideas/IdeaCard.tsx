
"use client";

import type { Idea } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface IdeaCardProps {
  idea: Idea;
  actionButton?: React.ReactNode;
  showDetailsLink?: boolean;
}

export default function IdeaCard({ idea, actionButton, showDetailsLink = false }: IdeaCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Idé
        </CardTitle>
        {idea.createdAt && (
           <CardDescription className="flex items-center gap-1 text-xs">
            <CalendarDays className="h-3 w-3" /> Sparad: {format(new Date(idea.createdAt), "PPP", { locale: sv })}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm whitespace-pre-wrap">{idea.content}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {actionButton}
        {showDetailsLink && (
          <Button variant="outline" asChild>
            <Link href={`/my-ideas/${idea.id}`}>Visa Detaljer</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
