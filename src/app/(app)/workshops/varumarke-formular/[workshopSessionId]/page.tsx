
import BrandWorkshopMultiStepForm from "@/components/workshops/BrandWorkshopMultiStepForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building } from "lucide-react";

interface PageProps {
  params: {
    workshopSessionId: string;
  };
}

export default function VarumarkesWorkshopFormularPage({ params }: PageProps) {
  const { workshopSessionId } = params;

  // TODO: Fetch existing workshop data if session ID is valid and belongs to user.
  // This would involve another server action `getWorkshopSessionData(workshopSessionId)`.
  // For now, we'll pass undefined, meaning it starts fresh or loads from local state if any.

  return (
    <div className="space-y-8">
      <section className="flex items-center gap-4">
        <Building className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Varumärkesworkshop
          </h1>
          <p className="text-md text-muted-foreground">
            Fyll i stegen nedan. Dina framsteg sparas automatiskt.
          </p>
        </div>
      </section>
      
      <BrandWorkshopMultiStepForm workshopSessionId={workshopSessionId} />
    </div>
  );
}
