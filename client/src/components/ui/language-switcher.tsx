import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/translations";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const languages: { code: Language; label: string }[] = [
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'AR' },
    { code: 'en', label: 'EN' }
  ];

  return (
    <div className="flex items-center space-x-1 bg-white/10 rounded-full p-1" data-testid="language-switcher">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium transition-all",
            language === lang.code
              ? "bg-primary text-primary-foreground"
              : "bg-white/20 text-white hover:bg-white/30"
          )}
          data-testid={`lang-btn-${lang.code}`}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}
