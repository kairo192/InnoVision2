import { GlassCard } from "@/components/ui/glass-card";
import { useI18n } from "@/hooks/use-i18n";
import { Star, User } from "lucide-react";

export function Testimonials() {
  const { t } = useI18n();

  const testimonials = [
    {
      name: t('testimonials.student1.name'),
      role: t('testimonials.student1.role'),
      text: t('testimonials.student1.text')
    },
    {
      name: t('testimonials.student2.name'),
      role: t('testimonials.student2.role'),
      text: t('testimonials.student2.text')
    },
    {
      name: t('testimonials.student3.name'),
      role: t('testimonials.student3.role'),
      text: t('testimonials.student3.text')
    }
  ];

  return (
    <section className="py-20 lg:py-32 gradient-bg relative" data-testid="testimonials-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6" data-testid="testimonials-title">
            {t('testimonials.title')}
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <GlassCard 
              key={index}
              hover
              className="p-8"
              data-testid={`testimonial-${index}`}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                  <User className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-white" data-testid={`testimonial-name-${index}`}>
                    {testimonial.name}
                  </h4>
                  <p className="text-white/70 text-sm" data-testid={`testimonial-role-${index}`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-white/90 leading-relaxed mb-4" data-testid={`testimonial-text-${index}`}>
                {testimonial.text}
              </p>
              <div className="flex" data-testid={`testimonial-rating-${index}`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-accent fill-current" />
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
