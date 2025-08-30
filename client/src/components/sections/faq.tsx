import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { useI18n } from "@/hooks/use-i18n";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQ() {
  const { t } = useI18n();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: t('faq.q1.question'),
      answer: t('faq.q1.answer')
    },
    {
      question: t('faq.q2.question'),
      answer: t('faq.q2.answer')
    },
    {
      question: t('faq.q3.question'),
      answer: t('faq.q3.answer')
    },
    {
      question: t('faq.q4.question'),
      answer: t('faq.q4.answer')
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-background relative" data-testid="faq-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-6" data-testid="faq-title">
              {t('faq.title')}
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </div>
          
          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <GlassCard key={index} className="overflow-hidden" data-testid={`faq-item-${index}`}>
                <button 
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/10 transition-colors focus-visible"
                  onClick={() => toggleItem(index)}
                  data-testid={`faq-question-${index}`}
                >
                  <span className="font-semibold text-primary text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={cn(
                      "text-primary transition-transform w-5 h-5",
                      openItems.includes(index) && "rotate-180"
                    )}
                  />
                </button>
                {openItems.includes(index) && (
                  <div className="px-8 pb-6" data-testid={`faq-answer-${index}`}>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
