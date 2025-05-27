
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText, Construction } from "lucide-react";

export default function MinaDokumentPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">
          Mina Dokument
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Här samlas dina slutförda workshops och andra viktiga dokument.
        </p>
      </section>

      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="items-center">
          <Construction className="h-12 w-12 text-amber-500 mb-3" />
          <CardTitle className="text-2xl text-center">Under Uppbyggnad</CardTitle>
          <CardDescription className="text-center">
            Funktionen för att visa och hantera dokument är under utveckling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Snart kommer du kunna se dina exporterade workshop-sammanfattningar och andra filer här.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
