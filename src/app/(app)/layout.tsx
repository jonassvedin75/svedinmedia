
import type { ReactNode } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppSidebarProvider from '@/components/layout/AppSidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AppSidebarProvider>
        {children}
      </AppSidebarProvider>
    </ProtectedRoute>
  );
}
