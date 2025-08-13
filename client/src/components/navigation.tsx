import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    window.location.href = '/api/logout';
  };

  const navigation = [
    { name: 'Dashboard', href: '/', current: location === '/' },
    { name: 'Upload', href: '/upload', current: location === '/upload' },
    { name: 'Claims', href: '/claim-tracker', current: location.startsWith('/claim') },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setLocation('/')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-slate-900">ClaimMate</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && (
              <>
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setLocation(item.href)}
                    className={`${
                      item.current 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-slate-600 hover:text-primary'
                    } transition-colors pb-1`}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </button>
                ))}
                
                <div className="flex items-center space-x-4">
                  {(user as any)?.profileImageUrl && (
                    <img 
                      src={(user as any).profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm text-slate-600">
                    {(user as any)?.firstName || (user as any)?.email}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    data-testid="button-sign-out"
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="md:hidden pb-4 border-t border-slate-200 mt-4 pt-4">
            <div className="space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setLocation(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${
                    item.current 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-slate-600 hover:bg-slate-50'
                  } transition-colors`}
                  data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </button>
              ))}
              
              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex items-center space-x-3 px-4 py-2">
                  {(user as any)?.profileImageUrl && (
                    <img 
                      src={(user as any).profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm text-slate-600">
                    {(user as any)?.firstName || (user as any)?.email}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="w-full mt-2"
                  data-testid="mobile-button-sign-out"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
