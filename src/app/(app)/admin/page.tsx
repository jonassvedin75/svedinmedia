
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings, Construction } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <Settings className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">
          Adminpanel
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Hantering och administration av portalens funktioner.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Hantera Kreativa Timmen</CardTitle>
                <CardDescription>Administrera uppdrag och innehåll för Kreativa Timmen.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/admin/kreativa-timmen">Gå till Kreativa Timmen Admin</Link>
                </Button>
            </CardContent>
        </Card>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Hantera Kunddata</CardTitle>
                <CardDescription>Administrera kundspecifika inställningar som Drive-mapplänkar.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/admin/kunddata">Gå till Kunddata Admin</Link>
                </Button>
            </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-2xl mx-auto shadow-xl mt-12">
        <CardHeader className="items-center">
          <Construction className="h-12 w-12 text-amber-500 mb-3" />
          <CardTitle className="text-2xl text-center">Fler Adminfunktioner</CardTitle>
          <CardDescription className="text-center">
            Fler administrationsverktyg kommer att läggas till här.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
