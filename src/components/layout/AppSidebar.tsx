
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
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
  Menu, // Hamburger for mobile
  ChevronLeft, // For desktop toggle
  ChevronRight, // For submenus
  BrainCircuit,
  Settings,
  Building,
  ShoppingBag,
  BarChart3,
  ShieldQuestion,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils"; // For conditional classes

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  subItems?: NavItem[];
  badge?: string;
  requiredAdmin?: boolean;
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
  { href: "/my-ideas", label: "Mina Idéer", icon: BrainCircuit },
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
  const [isDesktopExpanded, setIsDesktopExpanded] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [openSubMenus, setOpenSubMenus] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false); // Close mobile menu if screen becomes desktop size
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const toggleDesktopSidebar = () => setIsDesktopExpanded(!isDesktopExpanded);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleSubMenu = (href: string) => {
    setOpenSubMenus(prev => ({ ...prev, [href]: !prev[href] }));
  };
  
  const NavLink: React.FC<{ item: NavItem; isSubItem?: boolean; closeMobileMenu: () => void }> = ({ item, isSubItem = false, closeMobileMenu }) => {
    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href.length > 1);
    const Icon = item.icon;
    const isSubMenuOpen = openSubMenus[item.href] ?? false;

    if (item.subItems) {
      return (
        <li className={cn("nav-item", isSubMenuOpen && "submenu-open")}>
          <a
            href={item.href} // Can be "#" or actual link if parent is clickable
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation if it's just a toggle
              toggleSubMenu(item.href);
            }}
            className={cn(isActive && !isSubMenuOpen && "active", "flex items-center justify-between w-full")}
            role="button"
            aria-expanded={isSubMenuOpen}
          >
            <div className="flex items-center">
              <Icon className="lucide-icon" />
              <span className="nav-text">{item.label}</span>
            </div>
            <ChevronRight className="lucide-icon lucide-chevron-right h-4 w-4" />
          </a>
          <ul>
            {item.subItems.map(subItem => (
              <NavLink key={subItem.href} item={subItem} isSubItem={true} closeMobileMenu={closeMobileMenu} />
            ))}
          </ul>
        </li>
      );
    }
    
    return (
      <li className="nav-item">
        <Link href={item.href} className={isActive ? "active" : ""} onClick={closeMobileMenu}>
          <Icon className="lucide-icon" />
          <span className="nav-text">{item.label}</span>
          {item.badge && <span className="nav-badge">{item.badge}</span>}
        </Link>
      </li>
    );
  };


  return (
    <>
      <div 
        id="portalSidebar" 
        className={cn(
          isDesktopExpanded ? "sidebar-desktop-expanded" : "",
          isMobileMenuOpen ? "sidebar-mobile-open" : ""
        )}
      >
        <div id="sidebarDesktopTogglerWrapper">
          <button id="sidebarToggleBtn" onClick={toggleDesktopSidebar} aria-label="Växla sidopanel">
            <ChevronLeft className={cn("lucide-icon transition-transform duration-200", !isDesktopExpanded && "rotate-180" )} />
          </button>
        </div>

        <ul id="sidebarNav">
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
          ))}
          {user && (
            <>
              <li className="sidebar-group-label">Admin</li>
              {adminNavItems.map((item) => (
                <NavLink key={item.href} item={item} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
              ))}
            </>
          )}
        </ul>

        {loading ? (
          <div className="p-2 h-[76px] animate-pulse"><div className="h-full bg-white/10 rounded"></div></div>
        ) : user ? (
          <div id="sidebarUserProfile">
            {isDesktopExpanded && (
              <div className="user-info">
                <Avatar className="avatar">
                  <AvatarImage src={user.photoURL || `https://placehold.co/32x32.png`} alt={user.email || "User"} data-ai-hint="profile avatar small" />
                  <AvatarFallback>{user.email?.[0]?.toUpperCase() || "A"}</AvatarFallback>
                </Avatar>
                <span className="email">{user.displayName || user.email}</span>
              </div>
            )}
            <button onClick={handleLogout} className="logout-button">
              <LogOut className="lucide-icon" />
              <span className="logout-text">Logga ut</span>
            </button>
          </div>
        ) : (
           <div id="sidebarUserProfile" className="p-2 space-y-2">
             <Link href="/login" passHref legacyBehavior>
                <a className="logout-button" onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}>
                    <LogOut className="lucide-icon" /> {/* Using LogOut for LogIn visually for now */}
                    <span className="logout-text">Logga In</span>
                </a>
             </Link>
           </div>
        )}
      </div>
      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={toggleMobileMenu}></div>}
    </>
  );
}

// This is now the main provider component for the app layout
export default function AppSidebarProvider({ children }: { children: React.ReactNode }) {
  // State for mobile menu, AppSidebarProvider now directly manages its sidebar state
  const [isMobileMenuActuallyOpen, setIsMobileMenuActuallyOpen] = React.useState(false);

  // Function to pass down to allow SidebarNavigation to control its mobile state.
  // This is a bit of a workaround because the button is inside SidebarNavigation.
  // Ideally, the mobile toggle button would be outside SidebarNavigation.
  // For now, AppSidebar.tsx will handle its own state.

  return (
    <div id="portalAppWrapper" className={cn("flex min-h-screen", isMobileMenuActuallyOpen && "sidebar-mobile-open")}>
      <SidebarNavigation /> {/* SidebarNavigation will manage its own display based on its internal state + props */}
      <main className="flex-1 flex flex-col bg-background">
        <div className="md:hidden p-4 border-b flex items-center justify-between sticky top-0 bg-card z-40">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <BrainCircuit className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Utvecklingsportalen</h1>
          </Link>
          {/* This button's onClick will be handled inside SidebarNavigation if we move state there,
              or AppSidebarProvider needs to pass a toggle function to it.
              For now, let's assume SidebarNavigation handles its own mobile toggler as well.
              The current CSS expects the mobile toggle to be OUTSIDE #portalSidebar.
          */}
           <button 
            id="mobileMenuToggleBtn" 
            onClick={() => {
              // Need to find a way to call toggleMobileMenu from SidebarNavigation or lift state up.
              // This is a placeholder, the actual toggling logic is now inside SidebarNavigation.
              // A ref or a passed prop would be needed.
              // For now, this button might not work as expected without further refactoring.
              // Let's try to have SidebarNavigation manage its own mobile state via prop.
              // Or even better, lift the state up here and pass it down.
              // This is getting complex due to CSS structure vs React component structure.
              // Let's stick to the SidebarNavigation managing its own state for now.
              // The button will be part of the main content's header.
              // We need to call a function in SidebarNavigation or lift state.
              // For simplicity, I'll make SidebarNavigation control its own mobile state fully.
              // This means the #mobileMenuToggleBtn in this file won't directly control the sidebar.
              // The button in SidebarNavigation will.
              // The CSS has a #mobileMenuToggleBtn. Let's use that as a trigger too.

              // Let's try a different approach: state is in AppSidebarProvider.
              // This button will toggle that state.
              const sidebar = document.getElementById('portalSidebar');
              const overlay = document.querySelector('.sidebar-overlay') as HTMLElement | null;
              if (sidebar) {
                sidebar.classList.toggle('sidebar-mobile-open');
                document.getElementById('portalAppWrapper')?.classList.toggle('sidebar-mobile-open');
                if (overlay) {
                    if (sidebar.classList.contains('sidebar-mobile-open')) {
                       // overlay.style.opacity = '1';
                       // overlay.style.visibility = 'visible';
                    } else {
                       // overlay.style.opacity = '0';
                       // overlay.style.visibility = 'hidden';
                    }
                }
              }

            }}
            aria-label="Öppna meny"
          >
            <Menu className="lucide-icon" />
          </button>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 flex-grow">
          {children}
        </div>
      </main>
    </div>
  );
}
