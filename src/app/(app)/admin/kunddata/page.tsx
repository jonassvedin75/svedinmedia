
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminDriveLinkSchema, type AdminDriveLinkFormData } from "@/types";
import { getPortalUsers, saveUserDriveLink, getUserDriveLink } from "@/actions/adminActions";
import { useAuth } from "@/contexts/AuthContext"; // To get current admin for basic check
import { useToast } from "@/hooks/use-toast";
import { Loader2, FolderKanban, Link2, AlertCircle, Users, Construction } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User as FirebaseUser } from "firebase/auth";

interface PortalUser extends Partial<FirebaseUser> {
    // Add any custom fields you might have in your userProfiles collection
    companyName?: string; 
}

export default function AdminKunddataPage() {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);
  
  const { user: adminUser } = useAuth(); // For basic check if someone is logged in
  const { toast } = useToast();

  const form = useForm<AdminDriveLinkFormData>({
    resolver: zodResolver(AdminDriveLinkSchema),
    defaultValues: {
      userId: "",
      driveUrl: "",
    },
  });

  useEffect(() => {
    async function fetchUsers() {
      setIsFetchingUsers(true);
      setErrorFetching(null);
      const response = await getPortalUsers();
      if (response.success && response.data) {
        setUsers(response.data as PortalUser[]); // Cast if your getPortalUsers returns more specific type
      } else {
        setErrorFetching(response.error || "Kunde inte hämta användare.");
        toast({ title: "Fel", description: response.error, variant: "destructive" });
      }
      setIsFetchingUsers(false);
    }
    if (adminUser) { // Only fetch if an admin (or any user for now) is logged in
        fetchUsers();
    } else {
        setIsFetchingUsers(false);
        setErrorFetching("Admin-autentisering krävs för att visa denna sida.");
    }
  }, [toast, adminUser]);

  useEffect(() => {
    if (selectedUserId) {
      form.setValue("userId", selectedUserId);
      // Fetch existing Drive URL for the selected user
      const fetchLink = async () => {
        setIsLoading(true);
        const response = await getUserDriveLink(selectedUserId);
        if (response.success && response.data?.driveUrl) {
          form.setValue("driveUrl", response.data.driveUrl);
        } else {
          form.setValue("driveUrl", ""); // Clear if no link or error
          if(!response.success) toast({title: "Fel", description: response.error, variant: "destructive"});
        }
        setIsLoading(false);
      };
      fetchLink();
    } else {
      form.reset({userId: "", driveUrl: ""});
    }
  }, [selectedUserId, form, toast]);

  const onSubmit = async (data: AdminDriveLinkFormData) => {
    if (!data.userId) {
        toast({ title: "Inget användare valt", description: "Välj en användare från listan.", variant: "destructive"});
        return;
    }
    setIsLoading(true);
    const result = await saveUserDriveLink(data.userId, data.driveUrl || "");
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Drive-länk Sparad!",
        description: `Länken har sparats för den valda användaren.`,
      });
    } else {
      toast({
        title: "Fel vid Sparande",
        description: result.error || "Ett okänt fel uppstod.",
        variant: "destructive",
      });
    }
  };
  
  const selectedUser = users.find(u => u.uid === selectedUserId);

  return (
    <div className="space-y-8">
      <section className="text-center">
        <FolderKanban className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">
          Admin: Kunddata
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Hantera kundspecifik data, som t.ex. Google Drive-mapplänkar.
        </p>
      </section>

      <Card className="w-full max-w-xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6"/> Välj Användare/Företag</CardTitle>
          <CardDescription>
            Välj en användare för att se eller uppdatera deras Google Drive-länk.
            Användare hämtas från 'userProfiles' i Firestore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetchingUsers && <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /> <p className="ml-2">Laddar användare...</p></div>}
          {errorFetching && !isFetchingUsers && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Fel</AlertTitle><AlertDescription>{errorFetching}</AlertDescription></Alert>}
          
          {!isFetchingUsers && !errorFetching && users.length > 0 && (
            <Select onValueChange={setSelectedUserId} value={selectedUserId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Välj en användare..." />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.uid} value={user.uid!}>
                    {user.displayName || user.email || user.uid} {user.companyName && `(${user.companyName})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
           {!isFetchingUsers && !errorFetching && users.length === 0 && (
             <p className="text-muted-foreground text-center py-4">Inga användare hittades i 'userProfiles'-samlingen.</p>
           )}
        </CardContent>
      </Card>

      {selectedUserId && selectedUser && (
        <Card className="w-full max-w-xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Link2 className="h-6 w-6"/> Google Drive-länk för {selectedUser.displayName || selectedUser.email}</CardTitle>
            <CardDescription>Ange eller uppdatera länken till användarens delade Google Drive-mapp.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="driveUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL till Google Drive-mapp</FormLabel>
                      <FormControl>
                        <Input placeholder="https://drive.google.com/drive/folders/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : "Spara Länk"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
       <Card className="w-full max-w-xl mx-auto shadow-md mt-8">
        <CardHeader className="items-center">
            <Construction className="h-10 w-10 text-amber-500 mb-2"/>
            <CardTitle className="text-xl text-center">Ytterligare Funktioner</CardTitle>
            <CardDescription className="text-center">
            Fler funktioner för kunddatahantering kan läggas till här, t.ex. visa slutförda workshops per kund, hantera specifika projektdata, etc.
            </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

    