
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { IdeasProvider } from '@/contexts/IdeasContext'; // Keep for Kreativa Timmen if needed
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <AuthProvider>
          <IdeasProvider> {/* Keep for potential use in Kreativa Timmen */}
                {children}
            <Toaster />
          </IdeasProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
