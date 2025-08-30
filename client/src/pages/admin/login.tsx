import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GlassCard } from "@/components/ui/glass-card";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/hooks/use-i18n";
import { apiRequest } from "@/lib/queryClient";
import { Lightbulb, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
  remember: z.boolean().default(false)
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Connexion réussie",
        description: "Redirection vers le tableau de bord..."
      });
      setLocation("/admin/dashboard");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || t('admin.login.error')
      });
    }
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4" data-testid="admin-login-page">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-accent rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-secondary rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-white rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <GlassCard className="p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center animate-pulse-glow">
                <Lightbulb className="text-white text-2xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2" data-testid="login-title">
              {t('admin.login.title')}
            </h1>
            <p className="text-muted-foreground">InnoVision School</p>
          </div>

          {/* Login Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary font-medium">
                {t('admin.login.email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@innovision.dz"
                className="glass border-white/20 focus:border-primary"
                data-testid="input-email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-destructive text-sm" data-testid="email-error">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary font-medium">
                {t('admin.login.password')}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="glass border-white/20 focus:border-primary pr-10"
                  data-testid="input-password"
                  {...form.register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-destructive text-sm" data-testid="password-error">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                {...form.register("remember")}
                data-testid="checkbox-remember"
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                {t('admin.login.remember')}
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-semibold transition-all hover:scale-105"
              disabled={loginMutation.isPending}
              data-testid="button-submit"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Connexion...</span>
                </div>
              ) : (
                t('admin.login.submit')
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 InnoVision School. Tous droits réservés.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
