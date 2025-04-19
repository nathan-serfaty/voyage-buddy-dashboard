
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Compass, MessageSquare, LayoutDashboard, Users, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { chatCompleted } = useUserPreferences();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    } else {
      navigate("/");
    }
  };

  const navigation = [
    { name: "Accueil", href: "/", icon: <Compass className="h-5 w-5" /> },
    { name: "Activités", href: "/activities", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Tableau de bord", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, requiresChat: true },
    { name: "Administration", href: "/admin", icon: <Users className="h-5 w-5" />, admin: true }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-primary font-bold text-xl">SGM</span>
              <span className="text-secondary font-bold text-xl ml-1">VOYAGES</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex items-center space-x-4">
              {navigation.map((item) => {
                if (item.requiresChat && !chatCompleted) return null;
                if (item.admin && !user) return null;
                
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {!chatCompleted && !user && (
              <Link to="/auth">
                <Button className="flex items-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  Connexion
                </Button>
              </Link>
            )}

            {user && (
              <Button onClick={handleLogout} variant="outline">
                Déconnexion
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navigation.map((item) => {
              if (item.requiresChat && !chatCompleted) return null;
              if (item.admin && !user) return null;
              
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
            {user ? (
              <Button 
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }} 
                variant="outline"
                className="w-full justify-start"
              >
                Déconnexion
              </Button>
            ) : (
              <Link 
                to="/auth" 
                className="block w-full" 
                onClick={() => setIsOpen(false)}
              >
                <Button className="w-full flex items-center justify-start">
                  <LogIn className="h-5 w-5 mr-2" />
                  Connexion
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
