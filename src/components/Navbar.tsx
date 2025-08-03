import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, DollarSign, BarChart3, PieChart, FileText, Menu, X, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { CompanySelector } from '@/components/company/CompanySelector';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Receitas', href: '/revenue', icon: DollarSign },
    { name: 'Despesas', href: '/expenses', icon: PieChart },
    { name: 'Relatórios', href: '/reports', icon: FileText },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-gray-100 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">FinFunerária</span>
            </Link>
            {user && <CompanySelector />}
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  location.pathname === item.href
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  location.pathname === "/admin"
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Link>
            )}
            
            {user && (
              <Button 
                variant="ghost"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-100 animate-slide-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === item.href
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === "/admin"
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Settings className="h-5 w-5 mr-3" />
                Admin
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Link>
            )}
            
            {user && (
              <button
                className="flex items-center px-3 py-2 rounded-md text-base font-medium w-full text-left text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sair
                <ChevronRight className="h-4 w-4 ml-auto" />
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// Links: Dashboard, Receitas, Despesas, Relatórios
// CompanySelector, botão de logout, menu mobile
