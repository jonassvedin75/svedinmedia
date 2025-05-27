
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MessageSquare, Construction } from "lucide-react";

export default function ChattSupportPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">
          Chatt & Support
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Få hjälp och ställ frågor direkt via vår chattfunktion.
        </p>
      </section>

      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="items-center">
          <Construction className="h-12 w-12 text-amber-500 mb-3" />
          <CardTitle className="text-2xl text-center">Under Uppbyggnad</CardTitle>
          <CardDescription className="text-center">
            Chattfunktionen är för närvarande under utveckling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Vi jobbar på att implementera en chatt för direktsupport. Kom tillbaka snart!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
