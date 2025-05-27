
import type { Metadata } from 'next';
// Removed Geist font imports
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { IdeasProvider } from '@/contexts/IdeasContext';
import { Toaster } from "@/components/ui/toaster";

// Removed geistSans and geistMono variables

export const metadata: Metadata = {
  title: 'Utvecklingsportalen',
  description: 'Din partner för affärsutveckling och innovation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      {/* Removed font variables from body className */}
      <body className={`antialiased bg-background text-foreground`}>
        <AuthProvider>
          <IdeasProvider>
                {children}
            <Toaster />
          </IdeasProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
