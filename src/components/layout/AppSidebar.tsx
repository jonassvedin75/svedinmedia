
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  Lightbulb,
  FileText,
  MessageSquare,
  BookOpen,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  Settings,
  ChevronDown,
  ChevronRight,
  Building,
  ShoppingBag,
  BarChart3,
  ShieldQuestion,
  DollarSign,
  Menu,
  BrainCircuit
} from "lucide-react";
import * as React from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  subItems?: NavItem[];
  badge?: string;
  requiredAdmin?: boolean; // For admin routes
}

const mainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/workshops",
    label: "Workshops",
    icon: Briefcase,
    subItems: [
      { href: "/workshops/varumarke", label: "Varumärke", icon: Building },
      { href: "/workshops/affarsutveckling", label: "Affärsutveckling", icon: ShoppingBag },
      { href: "/workshops/marknad", label: "Marknad", icon: BarChart3 },
      { href: "/workshops/kvalitetsarbete", label: "Kvalitetsarbete", icon: ShieldQuestion },
      { href: "/workshops/ekonomi", label: "Ekonomi", icon: DollarSign },
    ],
  },
  { href: "/kreativa-timmen", label: "Kreativa Timmen", icon: Lightbulb },
  { href: "/my-ideas", label: "Mina Idéer", icon: BrainCircuit }, // Existing page moved
  { href: "/mina-dokument", label: "Mina Dokument", icon: FileText },
  { href: "/chatt-support", label: "Chatt & Support", icon: MessageSquare },
  { href: "/kunskapsbank", label: "Kunskapsbank", icon: BookOpen },
];

const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Admin Översikt", icon: Settings, requiredAdmin: true },
  { href: "/admin/kreativa-timmen", label: "Hantera Kreativa Timmen", icon: Lightbulb, requiredAdmin: true },
  { href: "/admin/kunddata", label: "Hantera Kunddata", icon: FileText, requiredAdmin: true },
];


function SidebarNavigation() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { open, setOpen, isMobile, state: sidebarState, toggleSidebar, setOpenMobile, openMobile } = useSidebar();
  const [openSubMenus, setOpenSubMenus] = React.useState<Record<string, boolean>>({});

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    if (isMobile) setOpenMobile(false);
  };
  
  const toggleSubMenu = (href: string) => {
    setOpenSubMenus(prev => ({ ...prev, [href]: !prev[href] }));
  };

  const closeSidebarIfMobile = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const NavLink: React.FC<{ item: NavItem; isSubItem?: boolean }> = ({ item, isSubItem = false }) => {
    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href.length > 1);
    const Icon = item.icon;

    if (item.subItems) {
      const isSubMenuOpen = openSubMenus[item.href] ?? false;
      return (
        <>
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              onClick={() => {
                toggleSubMenu(item.href);
                // if (sidebarState === 'collapsed' && !isMobile) toggleSidebar(); // Expand if collapsed
              }}
              isActive={isActive && !isSubMenuOpen}
              className="justify-between"
              aria-expanded={isSubMenuOpen}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                {sidebarState === "expanded" || isMobile ? <span>{item.label}</span> : null}
              </div>
              {(sidebarState === "expanded" || isMobile) && (isSubMenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
            </SidebarMenuButton>
            {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
          </SidebarMenuItem>
          {isSubMenuOpen && (sidebarState === "expanded" || isMobile) && (
            <SidebarMenuSub>
              {item.subItems.map((subItem) => (
                 <SidebarMenuSubItem key={subItem.href}>
                    <Link href={subItem.href} passHref legacyBehavior>
                      <SidebarMenuSubButton 
                        isActive={pathname === subItem.href || pathname.startsWith(subItem.href)}
                        onClick={closeSidebarIfMobile}
                      >
                        {subItem.icon && <subItem.icon className="h-4 w-4" />}
                        <span>{subItem.label}</span>
                      </SidebarMenuSubButton>
                    </Link>
                  </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </>
      );
    }

    return (
      <SidebarMenuItem key={item.href}>
        <Link href={item.href} passHref legacyBehavior>
          <SidebarMenuButton isActive={isActive} onClick={closeSidebarIfMobile} tooltip={item.label}>
            <Icon className="h-5 w-5" />
             {(sidebarState === "expanded" || isMobile) && <span>{item.label}</span>}
          </SidebarMenuButton>
        </Link>
        {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
      </SidebarMenuItem>
    );
  };


  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "icon"}
      variant="sidebar"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
           <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-primary hover:opacity-80 transition-opacity" onClick={closeSidebarIfMobile}>
              <BrainCircuit className="h-7 w-7" />
              {(sidebarState === "expanded" || isMobile) && <h1 className="text-xl font-semibold">Utvecklingsportalen</h1>}
            </Link>
          {(sidebarState === "expanded" || isMobile) && <SidebarTrigger className="md:hidden data-[collapsible=offcanvas]:hidden" />}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {mainNavItems.map((item) => <NavLink key={item.href} item={item} />)}
          
          {/* Admin Section - Conditionally render based on user role if available */}
          {user && ( 
            <>
              <SidebarSeparator className="my-4" />
              <SidebarGroup>
                {(sidebarState === "expanded" || isMobile) && <SidebarGroupLabel className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Admin</SidebarGroupLabel>}
                 {adminNavItems.map((item) => <NavLink key={item.href} item={item} />)}
              </SidebarGroup>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {loading ? (
          <div className="h-10 bg-muted/50 rounded animate-pulse w-full"></div>
        ) : user ? (
          <div className="flex flex-col gap-2">
             {(sidebarState === "expanded" || isMobile) && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || `https://placehold.co/40x40.png`} alt={user.email || "User"} data-ai-hint="profile avatar" />
                  <AvatarFallback>{user.email?.[0]?.toUpperCase() || "A"}</AvatarFallback>
                </Avatar>
                <div className="text-sm overflow-hidden">
                  <p className="font-medium truncate">{user.displayName || user.email}</p>
                </div>
              </div>
             )}
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <LogOut className="mr-2 h-5 w-5" />
              {(sidebarState === "expanded" || isMobile) && <span>Logga ut</span>}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link href="/login" passHref legacyBehavior>
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={closeSidebarIfMobile}>
                <LogIn className="mr-2 h-5 w-5" />
                {(sidebarState === "expanded" || isMobile) && <span>Logga In</span>}
              </Button>
            </Link>
            <Link href="/signup" passHref legacyBehavior>
              <Button className="w-full justify-start bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" onClick={closeSidebarIfMobile}>
                <UserPlus className="mr-2 h-5 w-5" />
                 {(sidebarState === "expanded" || isMobile) && <span>Registrera</span>}
              </Button>
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}


export default function AppSidebarProvider({ children }: { children: React.ReactNode }) {
  // Load sidebar state from cookie
  const [initialOpen, setInitialOpen] = React.useState(true);
  React.useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('sidebar_state='))
      ?.split('=')[1];
    if (cookieValue) {
      setInitialOpen(cookieValue === 'true');
    }
  }, []);


  return (
    <SidebarProvider defaultOpen={initialOpen}>
      <div className="flex">
        <SidebarNavigation />
        <main className="flex-1 flex flex-col min-h-screen bg-background">
         <div className="md:hidden p-4 border-b flex items-center justify-between sticky top-0 bg-card z-40">
            <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                <BrainCircuit className="h-6 w-6" />
                <h1 className="text-lg font-semibold">Utvecklingsportalen</h1>
            </Link>
            <SidebarTrigger />
          </div>
          <div className="p-4 sm:p-6 lg:p-8 flex-grow">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
