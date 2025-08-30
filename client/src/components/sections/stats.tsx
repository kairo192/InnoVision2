import { GlassCard } from "@/components/ui/glass-card";
import { useI18n } from "@/hooks/use-i18n";
import { useEffect, useState } from "react";

export function Stats() {
  const { t } = useI18n();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      value: "95%",
      label: t('stats.placement'),
      description: t('stats.placementDesc')
    },
    {
      value: "5+",
      label: t('stats.experience'),
      description: t('stats.experienceDesc')
    },
    {
      value: "500+",
      label: t('stats.students'),
      description: t('stats.studentsDesc')
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-32 gradient-bg relative" data-testid="stats-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6" data-testid="stats-title">
            {t('stats.title')}
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <GlassCard 
              key={index}
              hover
              className="p-8 text-center"
              data-testid={`stat-${index}`}
            >
              <div 
                className={`text-4xl lg:text-5xl font-bold text-accent mb-4 transition-all duration-1000 ${
                  animated ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                data-testid={`stat-value-${index}`}
              >
                {stat.value}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2" data-testid={`stat-label-${index}`}>
                {stat.label}
              </h3>
              <p className="text-white/80" data-testid={`stat-description-${index}`}>
                {stat.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
