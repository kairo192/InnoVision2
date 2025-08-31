import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GlassCard } from "@/components/ui/glass-card";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/hooks/use-i18n";
import { insertApplicantSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { wilayas } from "@/lib/wilaya-data";
import { getAvailableCourses, calculateAge } from "@/lib/course-data";
import { Loader2, CheckCircle } from "lucide-react";
import { z } from "zod";

type EnrollmentForm = z.infer<typeof insertApplicantSchema>;

export function EnrollmentForm() {
  const [age, setAge] = useState<number | null>(null);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { t, language } = useI18n();

  const form = useForm<EnrollmentForm>({
    resolver: zodResolver(insertApplicantSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      fullName: "",
      email: "",
      birthDate: "",
      wilaya: "",
      phone: "",
      course: "",
      locale: language,
      consent: false
    }
  });

  // Update locale when language changes
  useEffect(() => {
    form.setValue("locale", language);
  }, [language, form]);

  // Watch birth date changes
  const watchedBirthDate = form.watch("birthDate");
  useEffect(() => {
    if (watchedBirthDate) {
      const calculatedAge = calculateAge(watchedBirthDate);
      setAge(calculatedAge);
      
      if (calculatedAge >= 8) {
        const courses = getAvailableCourses(calculatedAge).filter(course => course && course.trim() !== '');
        setAvailableCourses(courses);
        // Clear course selection if it's no longer valid
        const currentCourse = form.getValues("course");
        if (currentCourse && !courses.includes(currentCourse)) {
          form.setValue("course", "");
        }
      } else {
        setAvailableCourses([]);
        form.setValue("course", "");
      }
    } else {
      setAge(null);
      setAvailableCourses([]);
      form.setValue("course", "");
    }
  }, [watchedBirthDate, form]);

  const enrollmentMutation = useMutation({
    mutationFn: async (data: EnrollmentForm) => {
      const response = await apiRequest("POST", "/api/enrollment", data);
      return response.json();
    },
    onSuccess: (data) => {
      setIsSubmitted(true);
      toast({
        title: "Inscription réussie !",
        description: t('form.success'),
        duration: 5000
      });
      
      // Download PDF automatically
      if (data.pdfUrl) {
        window.open(data.pdfUrl, '_blank');
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription."
      });
    }
  });

  const onSubmit = (data: EnrollmentForm) => {
    enrollmentMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <GlassCard className="p-8 lg:p-12 text-center" data-testid="success-message">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white text-2xl w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-4">
            Félicitations !
          </h3>
          <p className="text-muted-foreground mb-6">
            Votre inscription a été confirmée avec succès. Vous recevrez un email de confirmation avec votre fiche d'inscription.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-primary font-medium">
              Prochaines étapes :
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Vérifiez votre email pour la confirmation</li>
              <li>• Conservez votre ID de candidature</li>
              <li>• Nous vous contacterons prochainement</li>
            </ul>
          </div>
          <Button
            onClick={() => window.open('https://wa.me/213797616944', '_blank')}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white"
            data-testid="whatsapp-contact"
          >
            Contactez-nous sur WhatsApp
          </Button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8 lg:p-12 shadow-2xl" data-testid="enrollment-form">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-primary">
              {t('form.fullName')} *
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Entrez votre nom complet"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              data-testid="input-fullname"
              {...form.register("fullName")}
            />
            {form.formState.errors.fullName && (
              <p className="text-destructive text-sm" data-testid="fullname-error">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-primary">
              {t('form.email')} *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              data-testid="input-email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-destructive text-sm" data-testid="email-error">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-sm font-medium text-primary">
              {t('form.birthDate')} *
            </Label>
            <Input
              id="birthDate"
              type="date"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              data-testid="input-birthdate"
              {...form.register("birthDate")}
            />
            {form.formState.errors.birthDate && (
              <p className="text-destructive text-sm" data-testid="birthdate-error">
                {form.formState.errors.birthDate.message}
              </p>
            )}
            {age !== null && (
              <p className="text-muted-foreground text-sm" data-testid="age-display">
                {age < 8 ? (
                  <span className="text-destructive">{t('form.ageError')}</span>
                ) : (
                  `${t('form.ageDisplay')}: ${age} ${age === 1 ? 'an' : 'ans'}`
                )}
              </p>
            )}
          </div>

          {/* Wilaya */}
          <div className="space-y-2">
            <Label htmlFor="wilaya" className="text-sm font-medium text-primary">
              {t('form.wilaya')} *
            </Label>
            <Select 
              value={form.watch("wilaya") || undefined}
              onValueChange={(value) => {
                if (value && value.trim() !== '') {
                  form.setValue("wilaya", value);
                  form.trigger("wilaya"); // Trigger validation
                }
              }} 
              data-testid="select-wilaya"
            >
              <SelectTrigger className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                <SelectValue placeholder={t('form.selectWilaya')} />
              </SelectTrigger>
              <SelectContent>
                {wilayas
                  .filter(wilaya => wilaya.name && wilaya.name.trim() !== '')
                  .map((wilaya) => (
                    <SelectItem key={wilaya.name} value={wilaya.name}>
                      {wilaya.code} - {wilaya.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            {form.formState.errors.wilaya && (
              <p className="text-destructive text-sm" data-testid="wilaya-error">
                {form.formState.errors.wilaya.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-primary">
              {t('form.phone')} *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder={t('form.phonePlaceholder')}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              data-testid="input-phone"
              {...form.register("phone")}
            />
            {form.formState.errors.phone && (
              <p className="text-destructive text-sm" data-testid="phone-error">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          {/* Course Selection */}
          <div className="space-y-2">
            <Label htmlFor="course" className="text-sm font-medium text-primary">
              {t('form.course')} *
            </Label>
            <Select 
              onValueChange={(value) => {
                form.setValue("course", value);
                form.trigger("course"); // Trigger validation
              }}
              disabled={availableCourses.length === 0}
              data-testid="select-course"
            >
              <SelectTrigger className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50">
                <SelectValue placeholder={t('form.selectCourse')} />
              </SelectTrigger>
              <SelectContent>
                {availableCourses
                  .filter(course => course && course.trim() !== '')
                  .map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            {form.formState.errors.course && (
              <p className="text-destructive text-sm" data-testid="course-error">
                {form.formState.errors.course.message}
              </p>
            )}
            <p className="text-muted-foreground text-sm">
              {t('form.courseNote')}
            </p>
          </div>
        </div>

        {/* GDPR Consent */}
        <div className="flex items-start space-x-3 mt-8">
          <Checkbox
            id="consent"
            checked={form.watch("consent")}
            onCheckedChange={(checked) => {
              form.setValue("consent", checked as boolean);
              form.trigger("consent"); // Trigger validation
            }}
            className="mt-1"
            data-testid="checkbox-consent"
          />
          <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
            {t('form.consent')}
          </Label>
        </div>
        {form.formState.errors.consent && (
          <p className="text-destructive text-sm" data-testid="consent-error">
            {form.formState.errors.consent.message}
          </p>
        )}

        {/* Submit Button */}
        <div className="text-center mt-8">
          <Button
            type="submit"
            className="bg-accent hover:bg-accent/90 disabled:bg-muted disabled:cursor-not-allowed text-accent-foreground px-12 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg min-w-[200px]"
            disabled={
              enrollmentMutation.isPending || 
              (age !== null && age < 8) ||
              !form.watch("fullName") ||
              !form.watch("email") ||
              !form.watch("birthDate") ||
              !form.watch("wilaya") ||
              !form.watch("phone") ||
              !form.watch("course") ||
              !form.watch("consent")
            }
            data-testid="button-submit"
          >
            {enrollmentMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="animate-spin w-4 h-4" />
                <span>{t('form.processing')}</span>
              </div>
            ) : (
              t('form.submit')
            )}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
