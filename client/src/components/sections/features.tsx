import { GlassCard } from "@/components/ui/glass-card";
import { useI18n } from "@/hooks/use-i18n";
import { 
  Bot, 
  Shield, 
  Brain, 
  Printer, 
  Code, 
  Video, 
  Palette, 
  Crown 
} from "lucide-react";

const features = [
  { key: 'robotics', icon: Bot },
  { key: 'cybersecurity', icon: Shield },
  { key: 'ai', icon: Brain },
  { key: 'printing3d', icon: Printer },
  { key: 'webmobile', icon: Code },
  { key: 'video', icon: Video },
  { key: 'design', icon: Palette },
  { key: 'chess', icon: Crown }
];

export function Features() {
  const { t } = useI18n();

  return (
    <section id="courses" className="py-20 lg:py-32 bg-background relative" data-testid="features-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-6" data-testid="features-title">
            {t('features.title')}
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <GlassCard 
                key={feature.key}
                hover
                className="p-6 lg:p-8 group"
                data-testid={`feature-${feature.key}`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary transition-colors">
                    <Icon className="text-white text-2xl w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3" data-testid={`feature-${feature.key}-title`}>
                    {t(`features.${feature.key}.title` as any)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed" data-testid={`feature-${feature.key}-description`}>
                    {t(`features.${feature.key}.description` as any)}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
