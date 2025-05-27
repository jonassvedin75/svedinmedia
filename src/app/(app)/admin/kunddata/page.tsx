
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Construction } from "lucide-react"; // Changed icon to FolderKanban
import Link from "next/link";

export default function AdminKunddataPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <FolderKanban className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">
          Admin: Kunddata
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Hantering av kundspecifik data, som t.ex. Drive-mapplänkar.
        </p>
      </section>

      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="items-center">
          <Construction className="h-12 w-12 text-amber-500 mb-3" />
          <CardTitle className="text-2xl text-center">Under Uppbyggnad</CardTitle>
          <CardDescription className="text-center">
            Denna administrationssida är för närvarande under utveckling.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild variant="outline">
            <Link href="/admin">Tillbaka till Adminpanelen</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
