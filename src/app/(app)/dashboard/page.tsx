
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lightbulb, Briefcase, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">
          Välkommen till Dashboard, {user?.displayName || user?.email || "Användare"}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Här är din översikt och snabbåtkomst till portalens funktioner.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Workshops</CardTitle>
            </div>
            <CardDescription>
              Starta eller fortsätt med guidade workshops för att utveckla ditt företag.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/workshops">Gå till Workshops</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Kreativa Timmen</CardTitle>
            </div>
            <CardDescription>
              Få AI-genererad inspiration och bolla idéer för dina projekt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/kreativa-timmen">Starta Kreativa Timmen</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Mina Dokument</CardTitle>
            </div>
            <CardDescription>
              Se dina sparade workshop-svar och andra viktiga dokument.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/mina-dokument">Visa Mina Dokument</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Placeholder for recent activity or notifications */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Senaste Aktivitet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Ingen aktivitet ännu.</p>
            {/* TODO: Lista nyligen startade/avslutade workshops etc. */}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
