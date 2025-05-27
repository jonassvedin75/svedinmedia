
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreativeHourMissionSchema, type CreativeHourMission } from "@/types";
import { getCreativeHourMissions, addCreativeHourMission, updateCreativeHourMission, deleteCreativeHourMission } from "@/actions/creativeHourActions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Edit3, Trash2, Lightbulb, AlertCircle, ListChecks, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type MissionFormData = Omit<CreativeHourMission, "id">;

export default function AdminKreativaTimmenPage() {
  const [missions, setMissions] = useState<CreativeHourMission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMissions, setIsFetchingMissions] = useState(true);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);
  const [editingMission, setEditingMission] = useState<CreativeHourMission | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { toast } = useToast();

  const form = useForm<MissionFormData>({
    resolver: zodResolver(CreativeHourMissionSchema.omit({id: true})),
    defaultValues: {
      title: "",
      category: "",
      taskDescription: "",
      bonusTask: "",
      missionOrder: 0,
    },
  });

  const fetchMissions = async () => {
    setIsFetchingMissions(true);
    setErrorFetching(null);
    const response = await getCreativeHourMissions();
    if (response.success && response.data) {
      setMissions(response.data);
    } else {
      setErrorFetching(response.error || "Kunde inte hämta uppdrag.");
      toast({ title: "Fel", description: response.error, variant: "destructive" });
    }
    setIsFetchingMissions(false);
  };

  useEffect(() => {
    fetchMissions();
  }, [toast]); // Removed form from dependencies as it caused infinite loop with reset

  const handleFormSubmit = async (data: MissionFormData) => {
    setIsLoading(true);
    let response;
    if (editingMission) {
      response = await updateCreativeHourMission(editingMission.id, data);
    } else {
      response = await addCreativeHourMission(data);
    }
    setIsLoading(false);

    if (response.success) {
      toast({ title: editingMission ? "Uppdrag Uppdaterat" : "Uppdrag Tillagt", description: response.message });
      form.reset();
      setEditingMission(null);
      setShowAddForm(false);
      fetchMissions(); // Refresh list
    } else {
      toast({ title: "Fel", description: response.error, variant: "destructive" });
    }
  };

  const handleEdit = (mission: CreativeHourMission) => {
    setEditingMission(mission);
    setShowAddForm(true);
    form.reset({
        title: mission.title,
        category: mission.category,
        taskDescription: mission.taskDescription,
        bonusTask: mission.bonusTask || "",
        missionOrder: mission.missionOrder,
    });
  };

  const handleDelete = async (missionId: string) => {
    // Basic confirmation, consider using AlertDialog for better UX
    if (!confirm("Är du säker på att du vill radera detta uppdrag?")) return;

    setIsLoading(true);
    const response = await deleteCreativeHourMission(missionId);
    setIsLoading(false);

    if (response.success) {
      toast({ title: "Uppdrag Raderat", description: response.message });
      fetchMissions(); // Refresh list
    } else {
      toast({ title: "Fel", description: response.error, variant: "destructive" });
    }
  };
  
  const MissionForm = ({ isEditing }: { isEditing: boolean }) => (
    <Card className="mb-8">
        <CardHeader>
            <CardTitle>{isEditing ? "Redigera Uppdrag" : "Lägg till Nytt Uppdrag"}</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Titel</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <FormControl><Input {...field} placeholder="T.ex. Varumärkesarbete, Affärsplanering" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="taskDescription" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Uppdragsbeskrivning</FormLabel>
                        <FormControl><Textarea {...field} rows={3} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="bonusTask" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bonusuppgift (valfritt)</FormLabel>
                        <FormControl><Textarea {...field} rows={2} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="missionOrder" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ordningsnummer (lägre först)</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value,10) || 0)} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : (isEditing ? "Spara Ändringar" : "Lägg till Uppdrag")}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingMission(null); form.reset(); }}>
                        Avbryt
                    </Button>
                </div>
            </form>
            </Form>
        </CardContent>
    </Card>
  );


  return (
    <div className="space-y-8">
      <section className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Lightbulb className="h-7 w-7" /> Hantera "Kreativa Timmen"-Uppdrag
            </h1>
            <p className="text-muted-foreground">Skapa, redigera och radera uppdrag.</p>
        </div>
        {!showAddForm && (
            <Button onClick={() => { setShowAddForm(true); setEditingMission(null); form.reset();}}>
                <PlusCircle className="mr-2 h-5 w-5" /> Lägg till Nytt Uppdrag
            </Button>
        )}
      </section>

      {showAddForm && <MissionForm isEditing={!!editingMission} />}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ListChecks /> Befintliga Uppdrag</CardTitle>
          <CardDescription>Lista över alla aktiva uppdrag för Kreativa Timmen.</CardDescription>
        </CardHeader>
        <CardContent>
          {isFetchingMissions && <div className="flex justify-center py-4"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <p className="ml-2">Laddar uppdrag...</p></div>}
          {errorFetching && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Fel</AlertTitle><AlertDescription>{errorFetching}</AlertDescription></Alert>}
          {!isFetchingMissions && !errorFetching && missions.length === 0 && (
            <p className="text-muted-foreground text-center py-4">Inga uppdrag funna. Lägg till ditt första uppdrag!</p>
          )}
          {!isFetchingMissions && !errorFetching && missions.length > 0 && (
            <div className="space-y-4">
              {missions.map(mission => (
                <Card key={mission.id} className="shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl">{mission.title} <span className="text-sm font-normal text-muted-foreground">(Order: {mission.missionOrder})</span></CardTitle>
                            <CardDescription>Kategori: {mission.category}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" title="Visa detaljer"><Eye className="h-5 w-5" /></Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                    <DialogTitle>{mission.title}</DialogTitle>
                                    <DialogDescription>Kategori: {mission.category} | Order: {mission.missionOrder}</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-2 py-4">
                                        <p><strong>Beskrivning:</strong> {mission.taskDescription}</p>
                                        {mission.bonusTask && <p><strong>Bonus:</strong> {mission.bonusTask}</p>}
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild><Button variant="outline">Stäng</Button></DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(mission)} title="Redigera">
                                <Edit3 className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(mission.id)} disabled={isLoading} title="Radera">
                                <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                        </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
       <Card className="mt-8">
        <CardHeader>
            <CardTitle>Information om Uppdrag</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2">
            <p>Här är några exempel på uppdrag du kan lägga till. Kopiera gärna texterna och skapa nya uppdrag.</p>
            <h4 className="font-semibold text-foreground pt-2">Varumärkesarbete Kategori:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>30 seconds of fame:</strong> Tänk att ditt företag/du som företagare får 30 sekunder i ett rikstäckande TV-program för att presentera dig. Vad säger du?</li>
                <li><strong>Du vs företag:</strong> Tänk dig att du och ditt företag är karaktärer i en realityserie. Vilka är era personlighetsdrag, styrkor och (charmiga) egenheter?</li>
                <li><strong>Släpp fram din dolda sida:</strong> Finns det någon sida av din personlighet eller ditt företags karaktär som du ofta tonar ner i professionella sammanhang, men som egentligen skulle kunna vara en styrka?</li>
                {/* ... add more examples as list items ... */}
            </ul>
             <h4 className="font-semibold text-foreground pt-2">Affärsplanering Kategori:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Förklara för ett barn:</strong> Hur skulle du på max 30 sekunder förklara för ett barn vad du jobbar med och vilket värde ditt företag skapar?</li>
                <li><strong>Monopol eller verklighet?:</strong> Om ditt företags ekonomi var ett Monopolspel, hur skulle spelplanen se ut idag? Om ett år? Om tre år? Vilka är dina "chans"-kort och "allmänning"-kort?</li>
                 {/* ... add more examples as list items ... */}
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}

    