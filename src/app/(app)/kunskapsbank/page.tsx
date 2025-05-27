
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen, Construction } from "lucide-react";

export default function KunskapsbankPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">
          Kunskapsbank
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Utforska artiklar, guider och resurser för att fördjupa din kunskap.
        </p>
      </section>

       <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="items-center">
          <Construction className="h-12 w-12 text-amber-500 mb-3" />
          <CardTitle className="text-2xl text-center">Under Uppbyggnad</CardTitle>
          <CardDescription className="text-center">
            Kunskapsbanken är för närvarande under utveckling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Vi fyller på med värdefullt innehåll. Kom tillbaka snart för att ta del av det!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
