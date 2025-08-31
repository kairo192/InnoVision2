import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Logo } from "@/components/ui/logo";
import { useI18n } from "@/hooks/use-i18n";
import { Download } from "lucide-react";

export function Hero() {
  const { t } = useI18n();

  const scrollToSignup = () => {
    const element = document.getElementById('signup');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden hero-gradient" data-testid="hero-section">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-accent rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-secondary rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-white rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-accent rounded-full animate-float opacity-30" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 border border-white/20 rotate-45 animate-float opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border border-accent/30 rotate-12 animate-float opacity-20" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-8 lg:p-12 shadow-2xl animate-slide-up">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Logo size="xl" className="animate-pulse-glow" />
                <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
              </div>
            </div>
            
            {/* Headline */}
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight" data-testid="hero-title">
              {t('hero.title')}
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="hero-subtitle">
              {t('hero.subtitle')}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={scrollToSignup}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg min-w-[200px]"
                data-testid="hero-cta-signup"
              >
                {t('hero.cta1')}
              </Button>
              <Button 
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 min-w-[200px]"
                data-testid="hero-cta-brochure"
              >
                <Download className="mr-2 w-4 h-4" />
                {t('hero.cta2')}
              </Button>
            </div>
            
            {/* School Address */}
            <div className="mt-8 text-white/80 text-sm lg:text-base" data-testid="hero-address">
              <i className="fas fa-map-marker-alt mr-2"></i>
              {t('hero.address')}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
