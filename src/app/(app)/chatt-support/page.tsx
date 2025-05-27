
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ChattSupportPage() {
  const googleChatSpaceUrl = "https://mail.google.com/chat/u/0/#chat/space/AAQADDrUTHI";

  return (
    <div className="space-y-8">
      <section className="text-center">
        <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">
          Chatt & Support
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Få hjälp och ställ frågor direkt via vår Google Chat-kanal.
        </p>
      </section>

      <Card className="w-full max-w-lg mx-auto shadow-xl">
        <CardHeader className="items-center">
          <CardTitle className="text-2xl text-center">Anslut till vår Supportkanal</CardTitle>
          <CardDescription className="text-center">
            Klicka på knappen nedan för att öppna vår dedikerade supportkanal i Google Chat.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild size="lg">
            <Link href={googleChatSpaceUrl} target="_blank" rel="noopener noreferrer">
              Öppna Google Chat Support <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Du kommer att omdirigeras till Google Chat i en ny flik.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    