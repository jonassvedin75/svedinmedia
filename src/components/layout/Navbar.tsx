
"use client";

import Link from 'next/link';
import { BrainCircuit, LogIn, UserPlus, ListChecks, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <BrainCircuit className="h-7 w-7" />
          <h1 className="text-xl font-semibold">Utvecklingsportalen</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button variant="link" asChild>
            <Link href="/">Hem</Link>
          </Button>
          {loading ? (
            <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
          ) : user ? (
            <>
              <Button variant="link" asChild>
                <Link href="/my-ideas">Mina Idéer</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || `https://placehold.co/100x100.png`} alt={user.displayName || user.email || 'User'} data-ai-hint="profile avatar" />
                      <AvatarFallback>{user.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logga ut</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" /> Logga In
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" /> Registrera
                </Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
