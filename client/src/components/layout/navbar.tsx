import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Logo } from "@/components/ui/logo";
import { useI18n } from "@/hooks/use-i18n";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20" data-testid="navbar">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Logo size="md" />
            <span className="text-lg lg:text-xl font-bold text-primary">InnoVision School</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-primary hover:text-secondary transition-colors focus-visible"
              data-testid="nav-home"
            >
              {t('nav.home')}
            </button>
            <button 
              onClick={() => scrollToSection('courses')}
              className="text-primary hover:text-secondary transition-colors focus-visible"
              data-testid="nav-courses"
            >
              {t('nav.courses')}
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-primary hover:text-secondary transition-colors focus-visible"
              data-testid="nav-about"
            >
              {t('nav.about')}
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-primary hover:text-secondary transition-colors focus-visible"
              data-testid="nav-contact"
            >
              {t('nav.contact')}
            </button>
          </div>
          
          {/* Language Switcher & CTA */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            
            <Button 
              onClick={() => scrollToSection('signup')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 lg:px-6 lg:py-3 rounded-xl font-semibold transition-all hover:scale-105"
              data-testid="cta-signup"
            >
              {t('nav.signup')}
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden glass p-2 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="text-primary" /> : <Menu className="text-primary" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-dark border-t border-white/20" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-3">
            <button 
              onClick={() => scrollToSection('home')}
              className="block w-full text-left text-white hover:text-secondary transition-colors py-2"
              data-testid="mobile-nav-home"
            >
              {t('nav.home')}
            </button>
            <button 
              onClick={() => scrollToSection('courses')}
              className="block w-full text-left text-white hover:text-secondary transition-colors py-2"
              data-testid="mobile-nav-courses"
            >
              {t('nav.courses')}
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-white hover:text-secondary transition-colors py-2"
              data-testid="mobile-nav-about"
            >
              {t('nav.about')}
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-white hover:text-secondary transition-colors py-2"
              data-testid="mobile-nav-contact"
            >
              {t('nav.contact')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
