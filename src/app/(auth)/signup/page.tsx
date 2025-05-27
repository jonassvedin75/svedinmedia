
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SignupFormData } from "@/types"; // Updated to SignupFormData
import { SignupSchema } from "@/types"; // Updated to SignupSchema
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, UserPlus } from "lucide-react";
import Link from "next/link";

export default function SignupPage() { // Renamed from RegisterPage
  const { signup, error: authError, clearError } = useAuth(); // use signup
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignupFormData>({ // Use SignupFormData
    resolver: zodResolver(SignupSchema), // Use SignupSchema
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => { // Use SignupFormData
    clearError();
    const user = await signup(data); // use signup
    if (user) {
      toast({
        title: "Registrering lyckades",
        description: `Välkommen, ${user.email}! Du är nu inloggad.`,
      });
      router.push("/dashboard"); 
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
          <UserPlus className="h-7 w-7 text-primary" /> Skapa Konto
        </CardTitle>
        <CardDescription>Skapa ett nytt konto för att få tillgång till portalen.</CardDescription>
      </CardHeader>
      <CardContent>
        {authError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Registreringsfel</AlertTitle>
            <AlertDescription>
              {authError.message.includes("auth/email-already-in-use")
                ? "E-postadressen används redan."
                : "Ett oväntat fel uppstod. Försök igen."}
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-postadress</FormLabel>
                  <FormControl>
                    <Input placeholder="din@epost.se" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lösenord</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="•••••••• (minst 6 tecken)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bekräfta Lösenord</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Registrerar..." : "Skapa Konto"}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Har du redan ett konto?{" "}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href="/login">
              Logga in här
            </Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
