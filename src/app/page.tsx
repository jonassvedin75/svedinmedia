
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, LogIn, UserPlus, CheckSquare } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || (!loading && user)) {
    // Show a loading state or nothing while redirecting
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <BrainCircuit className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-card shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <BrainCircuit className="h-7 w-7" />
            <h1 className="text-xl font-semibold">Utvecklingsportalen</h1>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" /> Logga In
              </Link>
            </Button>
            <Button asChild>
              <Link href="/signup" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" /> Registrera
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center py-12 md:py-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary mb-6">
            Välkommen till Utvecklingsportalen
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Din partner för att strukturera, utveckla och förverkliga dina affärsidéer. Starta en workshop, få kreativ input och hantera dina projekt på ett ställe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Kom igång gratis</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Logga in</Link>
            </Button>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-primary mb-4">Guidade Workshops</h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Genomgå interaktiva workshops inom varumärke, affärsutveckling, marknadsföring och mer. Svara på frågor, få insikter och skapa en solid grund för ditt företag.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2"><CheckSquare className="h-5 w-5 text-primary" /> Steg-för-steg vägledning</li>
                <li className="flex items-center gap-2"><CheckSquare className="h-5 w-5 text-primary" /> Spara dina framsteg</li>
                <li className="flex items-center gap-2"><CheckSquare className="h-5 w-5 text-primary" /> Exportera dina resultat (framtida)</li>
              </ul>
            </div>
            <div>
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Workshop illustration" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-xl"
                data-ai-hint="workshop collaboration" 
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-card rounded-lg shadow-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-primary mb-8 text-center">Fler Funktioner</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Kreativa Timmen</CardTitle></CardHeader>
              <CardContent><CardDescription>Få AI-genererad input och idéer för att kickstarta din kreativitet.</CardDescription></CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Mina Dokument</CardTitle></CardHeader>
              <CardContent><CardDescription>Samla alla dina workshop-resultat och viktiga dokument på ett ställe.</CardDescription></CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Kunskapsbank</CardTitle></CardHeader>
              <CardContent><CardDescription>Utforska artiklar, guider och resurser för att fördjupa din kunskap.</CardDescription></CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-muted text-muted-foreground py-8 text-center">
        <p>&copy; {new Date().getFullYear()} Utvecklingsportalen. Alla rättigheter förbehållna.</p>
      </footer>
    </div>
  );
}
