
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Construction } from "lucide-react";
import Link from "next/link";

export default function MarknadPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">
          Workshop: Marknad
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Planera och optimera din marknadsföring.
        </p>
      </section>

      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="items-center">
          <Construction className="h-12 w-12 text-amber-500 mb-3" />
          <CardTitle className="text-2xl text-center">Under Uppbyggnad</CardTitle>
          <CardDescription className="text-center">
            Denna workshop är för närvarande under utveckling. Kom tillbaka snart!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild variant="outline">
            <Link href="/workshops">Tillbaka till alla workshops</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
