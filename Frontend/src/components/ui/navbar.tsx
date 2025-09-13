import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, User, Plus, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "./logo";

interface NavbarProps {
  isAuthenticated?: boolean;
  onToggleTheme?: () => void;
  isDark?: boolean;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export function Navbar({ isAuthenticated = false, onToggleTheme, isDark = false, isAdmin = false, onLogout }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/voitures", label: "Voitures" },
    { href: "/a-propos", label: "À propos" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
    ...(isAuthenticated ? [
      { href: "/mes-annonces", label: "Mes annonces" },
      ...(isAdmin ? [{ href: "/admin", label: "Administration" }] : []),
    ] : []),
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    // Afficher un message de confirmation
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    });
    
    // Appeler la fonction de déconnexion du parent si fournie
    if (onLogout) {
      onLogout();
    }
    
    // Rediriger vers la page d'accueil
    window.location.href = '/';
  };
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <Logo size="md" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleTheme}
              className="h-9 w-9 p-0"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/deposer">
                    <Plus className="h-4 w-4 mr-1" />
                    Déposer
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profil">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-1" />
                  Connexion
                </Link>
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-9 w-9 p-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="px-2 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href) 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-2 border-t space-y-2">
                {isAuthenticated ? (
                  <>
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <Link to="/deposer" onClick={() => setIsMobileMenuOpen(false)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Déposer une annonce
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link to="/profil" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Mon profil
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <Button variant="default" size="sm" className="w-full justify-start" asChild>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Connexion
                    </Link>
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleTheme}
                  className="w-full justify-start"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Mode clair
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Mode sombre
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}