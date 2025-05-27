
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen, Construction, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function KunskapsbankPage() {
  // PLATSHÅLLARE: Ersätt med den faktiska Google Site URL:en när Jonas tillhandahåller den.
  const googleSiteUrl = "https://sites.google.com/view/exempelsida-kunskapsbank"; // Exempel URL

  return (
    <div className="space-y-8">
      <section className="text-center">
        <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">
          Kunskapsbank
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Utforska artiklar, guider och resurser för att fördjupa din kunskap.
        </p>
      </section>

      {/* Meddelande om att Google Site URL saknas om den är exempel */}
      {googleSiteUrl === "https://sites.google.com/view/exempelsida-kunskapsbank" && (
        <Card className="w-full max-w-2xl mx-auto shadow-md bg-amber-50 border-amber-300">
            <CardHeader>
                <CardTitle className="text-amber-700 flex items-center gap-2">
                    <Construction className="h-5 w-5" /> Platshållar-URL Används
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-amber-600">
                    Kunskapsbanken kommer att använda en Google Site. Den nuvarande länken och iframe:en använder en exempel-URL.
                    Jonas behöver tillhandahålla den riktiga URL:en för att denna sida ska fungera korrekt.
                    Just nu visas en knapp för att öppna exempel-URL:en externt.
                </p>
                 <Button asChild className="mt-4">
                    <Link href={googleSiteUrl} target="_blank" rel="noopener noreferrer">
                        Öppna Exempel Kunskapsbank (Extern länk) <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
      )}

      {/* När en riktig URL finns, kan iframe användas om så önskas och om Google Site tillåter inbäddning */}
      {/* Kontrollera X-Frame-Options på Google Site om iframe inte fungerar */}
      {googleSiteUrl !== "https://sites.google.com/view/exempelsida-kunskapsbank" ? (
        <Card className="w-full h-[calc(100vh-250px)] mx-auto shadow-xl overflow-hidden">
            <CardHeader>
                <CardTitle>Utforska Kunskapsbanken</CardTitle>
                <CardDescription>Innehållet nedan laddas från vår Google Site.</CardDescription>
            </CardHeader>
            <CardContent className="h-full pb-6">
                <iframe
                src={googleSiteUrl}
                title="Kunskapsbank Google Site"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Justera sandbox efter behov
                />
            </CardContent>
        </Card>
      ) : (
        <p className="text-center text-muted-foreground mt-6">
            När den korrekta länken till Google Site är konfigurerad kommer innehållet att visas här.
        </p>
      )}
    </div>
  );
}

    