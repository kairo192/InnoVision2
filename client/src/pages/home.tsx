import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Stats } from "@/components/sections/stats";
import { EnrollmentForm } from "@/components/forms/enrollment-form";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { useI18n } from "@/hooks/use-i18n";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen" data-testid="home-page">
      <Navbar />
      
      {/* SEO Meta */}
      <head>
        <title>{t('hero.title')} | InnoVision School</title>
        <meta name="description" content={t('hero.subtitle')} />
        <meta property="og:title" content={`${t('hero.title')} | InnoVision School`} />
        <meta property="og:description" content={t('hero.subtitle')} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://innovision-school.dz" />
      </head>

      <main>
        <Hero />
        <Features />
        <Stats />
        <section id="signup" className="py-20 lg:py-32 bg-background relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-6">
                  {t('form.title')}
                </h2>
                <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
              </div>
              <EnrollmentForm />
            </div>
          </div>
        </section>
        <Testimonials />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
