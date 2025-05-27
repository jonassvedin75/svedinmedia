
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building, ShoppingBag, BarChart3, ShieldQuestion, DollarSign, ArrowRight } from "lucide-react";

const workshopList = [
  { title: "Varumärkesworkshop", description: "Definiera och stärk ditt varumärke.", href: "/workshops/varumarke", icon: Building },
  { title: "Affärsutvecklingsworkshop", description: "Utforska nya möjligheter och strategier.", href: "/workshops/affarsutveckling", icon: ShoppingBag },
  { title: "Marknadsworkshop", description: "Planera och optimera din marknadsföring.", href: "/workshops/marknad", icon: BarChart3 },
  { title: "Kvalitetsarbetsworkshop", description: "Säkra och förbättra kvaliteten i dina processer.", href: "/workshops/kvalitetsarbete", icon: ShieldQuestion },
  { title: "Ekonomiworkshop", description: "Få bättre koll på och planera din ekonomi.", href: "/workshops/ekonomi", icon: DollarSign },
];

export default function WorkshopsPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">Workshops</h1>
        <p className="text-lg text-muted-foreground">
          Välj en workshop för att börja utveckla specifika delar av ditt företag.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshopList.map((workshop) => {
          const Icon = workshop.icon;
          return (
            <Card key={workshop.href} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">{workshop.title}</CardTitle>
                </div>
                <CardDescription>{workshop.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Additional content specific to each workshop card can go here if needed */}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={workshop.href}>
                    Starta Workshop <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
