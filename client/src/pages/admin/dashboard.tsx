import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence, useInView, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { Logo } from "@/components/ui/logo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/hooks/use-i18n";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { wilayas } from "@/lib/wilaya-data";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Download, 
  Mail, 
  FileText, 
  Search, 
  Filter,
  LogOut,
  PieChart,
  Activity,
  Target,
  BarChart3,
  Zap
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";

const COLORS = ['#0F4C81', '#35A7FF', '#FFC93C', '#0B2B43', '#87CEEB'];
const GRADIENT_COLORS = {
  primary: 'from-blue-500 to-blue-700',
  secondary: 'from-cyan-500 to-cyan-700', 
  accent: 'from-yellow-500 to-yellow-600',
  success: 'from-green-500 to-green-700',
  purple: 'from-purple-500 to-purple-700'
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const numberVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.5
    }
  }
};

// Advanced animations for enhanced UX
const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const shimmerVariants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
};

// Enhanced Loading Skeleton Component with shimmer effect
const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="glass p-6 rounded-xl overflow-hidden relative"
  >
    <div className="flex items-center justify-between">
      <div className="space-y-3 flex-1">
        <motion.div 
          className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
          style={{
            backgroundSize: "200% 100%"
          }}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="h-8 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-3/4"
          style={{
            backgroundSize: "200% 100%"
          }}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"
          style={{
            backgroundSize: "200% 100%"
          }}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      </div>
      <motion.div 
        className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl"
        style={{
          backgroundSize: "200% 100%"
        }}
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
      />
    </div>
    {/* Floating dots animation */}
    <motion.div
      className="absolute top-2 right-2 w-2 h-2 bg-blue-300 rounded-full"
      variants={floatingVariants}
      initial="initial"
      animate="animate"
    />
    <motion.div
      className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-purple-300 rounded-full"
      variants={{
        ...floatingVariants,
        animate: {
          ...floatingVariants.animate,
          transition: {
            ...floatingVariants.animate.transition,
            delay: 0.5
          }
        }
      }}
      initial="initial"
      animate="animate"
    />
  </motion.div>
);

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState({
    search: "",
    wilaya: "",
    course: "",
    ageGroup: "",
    dateFrom: "",
    dateTo: ""
  });
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const { toast } = useToast();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  // Check authentication
  const { data: user, isLoading: authLoading, error: authError } = useQuery<{
    id: string;
    email: string;
    role: string;
  }>({
    queryKey: ["/api/admin/me"],
    queryFn: getQueryFn({ on401: "returnNull" })
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && (!user || authError)) {
      setLocation("/admin/login");
    }
  }, [user, authLoading, authError, setLocation]);

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery<{
    total: number;
    today: number;
    thisWeek: number;
    courseDistribution: { course: string; count: number }[];
    wilayaDistribution: { wilaya: string; count: number }[];
    dailySignups: { date: string; signups: number }[];
  }>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user
  });

  // Fetch applicants
  const { data: applicantsData, isLoading: applicantsLoading } = useQuery({
    queryKey: ["/api/admin/applicants", filters, page],
    queryFn: () => {
      const params = new URLSearchParams({
        ...filters,
        limit: pageSize.toString(),
        offset: (page * pageSize).toString()
      });
      return fetch(`/api/admin/applicants?${params}`, { credentials: 'include' }).then(res => res.json());
    },
    enabled: !!user
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/logout"),
    onSuccess: () => {
      queryClient.clear();
      setLocation("/admin/login");
    }
  });

  // Resend email mutation
  const resendEmailMutation = useMutation({
    mutationFn: (applicantId: string) => 
      apiRequest("POST", `/api/admin/applicants/${applicantId}/resend-email`),
    onSuccess: () => {
      toast({
        title: "Email envoyé",
        description: t('admin.dashboard.emailSent')
      });
    }
  });

  const handleFilterChange = (key: string, value: string) => {
    // Convert special values back to empty strings for API
    const actualValue = (value === 'all-wilayas' || value === 'all-ages') ? '' : value;
    setFilters(prev => ({ ...prev, [key]: actualValue }));
    setPage(0);
  };

  const downloadPdf = (applicationId: string) => {
    window.open(`/api/pdf/${applicationId}`, '_blank');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-2 text-primary"
          >
            <Zap className="w-5 h-5" />
            <span className="font-medium">Chargement du tableau de bord...</span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950" 
      data-testid="admin-dashboard"
    >
      {/* Enhanced Animated Header with sophisticated backdrop */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground shadow-xl backdrop-blur-sm relative overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            backgroundSize: '200% 200%'
          }}
        />
        <motion.div
          className="absolute top-0 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/3 w-24 h-24 bg-white/3 rounded-full blur-2xl"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full blur-lg"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
                <Logo size="sm" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-2xl font-bold tracking-tight" 
                  data-testid="dashboard-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {t('admin.dashboard.title')}
                </motion.h1>
                <motion.p 
                  className="text-primary-foreground/80 text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Centre de contrôle InnoVision
                </motion.p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-6"
            >
              <motion.div 
                className="text-right"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.p 
                  className="text-sm text-primary-foreground/80"
                  animate={{
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  Bienvenue,
                </motion.p>
                <motion.p 
                  className="font-semibold"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {user.email}
                </motion.p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 bg-white/10 rounded-lg blur-md"
                  whileHover={{ scale: 1.1, opacity: 0.8 }}
                  transition={{ duration: 0.2 }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  className="border-white/20 text-white hover:bg-white/10 transition-all duration-200 relative z-10 backdrop-blur-sm"
                  data-testid="button-logout"
                >
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                  </motion.div>
                  {t('admin.dashboard.logout')}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced KPI Cards */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <AnimatePresence>
            {statsLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : (
              [
                // Total Applicants Card
                <motion.div
                  key="total"
                  variants={cardVariants}
                  whileHover="hover"
                  className="group"
                  data-testid="kpi-total"
                >
                  <GlassCard className="p-6 relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200/20 group-hover:shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500">
                    {/* Animated background overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    {/* Floating particles */}
                    <motion.div
                      className="absolute top-3 right-3 w-1 h-1 bg-blue-400 rounded-full"
                      variants={floatingVariants}
                      initial="initial"
                      animate="animate"
                    />
                    <motion.div
                      className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-60"
                      variants={{
                        ...floatingVariants,
                        animate: {
                          ...floatingVariants.animate,
                          transition: {
                            ...floatingVariants.animate.transition,
                            delay: 1
                          }
                        }
                      }}
                      initial="initial"
                      animate="animate"
                    />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">
                          {t('admin.dashboard.totalApplicants')}
                        </p>
                        <motion.p 
                          variants={numberVariants}
                          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                        >
                          <AnimatedCounter value={stats?.total || 0} />
                        </motion.p>
                        <p className="text-xs text-blue-600/70">Inscriptions totales</p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300"
                      >
                        <motion.div
                          variants={pulseVariants}
                          initial="initial"
                          animate="animate"
                        >
                          <Users className="w-8 h-8 text-white" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </GlassCard>
                </motion.div>,

                // Today's Applicants Card
                <motion.div
                  key="today"
                  variants={cardVariants}
                  whileHover="hover"
                  className="group"
                  data-testid="kpi-today"
                >
                  <GlassCard className="p-6 relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-cyan-600/20 border-cyan-200/20 group-hover:shadow-2xl group-hover:shadow-cyan-500/20 transition-all duration-500">
                    {/* Animated background overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    {/* Floating particles */}
                    <motion.div
                      className="absolute top-4 right-2 w-1.5 h-1.5 bg-cyan-400 rounded-full"
                      variants={{
                        ...floatingVariants,
                        animate: {
                          ...floatingVariants.animate,
                          transition: {
                            ...floatingVariants.animate.transition,
                            delay: 0.3
                          }
                        }
                      }}
                      initial="initial"
                      animate="animate"
                    />
                    <motion.div
                      className="absolute bottom-3 left-3 w-1 h-1 bg-cyan-300 rounded-full opacity-70"
                      variants={{
                        ...floatingVariants,
                        animate: {
                          ...floatingVariants.animate,
                          transition: {
                            ...floatingVariants.animate.transition,
                            delay: 1.2
                          }
                        }
                      }}
                      initial="initial"
                      animate="animate"
                    />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">
                          {t('admin.dashboard.todayApplicants')}
                        </p>
                        <motion.p 
                          variants={numberVariants}
                          className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent"
                        >
                          <AnimatedCounter value={stats?.today || 0} />
                        </motion.p>
                        <p className="text-xs text-cyan-600/70">Aujourd'hui</p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg group-hover:shadow-xl group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all duration-300"
                      >
                        <motion.div
                          variants={{
                            ...pulseVariants,
                            animate: {
                              ...pulseVariants.animate,
                              transition: {
                                ...pulseVariants.animate.transition,
                                delay: 0.5
                              }
                            }
                          }}
                          initial="initial"
                          animate="animate"
                        >
                          <Calendar className="w-8 h-8 text-white" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </GlassCard>
                </motion.div>,

                // This Week Card
                <motion.div
                  key="week"
                  variants={cardVariants}
                  whileHover="hover"
                  className="group"
                  data-testid="kpi-week"
                >
                  <GlassCard className="p-6 relative overflow-hidden bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 border-yellow-200/20 group-hover:shadow-2xl group-hover:shadow-yellow-500/20 transition-all duration-500">
                    {/* Animated background overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    {/* Floating particles */}
                    <motion.div
                      className="absolute top-2 right-4 w-1 h-1 bg-yellow-400 rounded-full"
                      variants={{
                        ...floatingVariants,
                        animate: {
                          ...floatingVariants.animate,
                          transition: {
                            ...floatingVariants.animate.transition,
                            delay: 0.7
                          }
                        }
                      }}
                      initial="initial"
                      animate="animate"
                    />
                    <motion.div
                      className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-80"
                      variants={floatingVariants}
                      initial="initial"
                      animate="animate"
                    />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">
                          {t('admin.dashboard.weekApplicants')}
                        </p>
                        <motion.p 
                          variants={numberVariants}
                          className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent"
                        >
                          <AnimatedCounter value={stats?.thisWeek || 0} />
                        </motion.p>
                        <p className="text-xs text-yellow-600/70">Cette semaine</p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg group-hover:shadow-xl group-hover:from-yellow-600 group-hover:to-yellow-700 transition-all duration-300"
                      >
                        <motion.div
                          variants={{
                            ...pulseVariants,
                            animate: {
                              ...pulseVariants.animate,
                              transition: {
                                ...pulseVariants.animate.transition,
                                delay: 1.0
                              }
                            }
                          }}
                          initial="initial"
                          animate="animate"
                        >
                          <TrendingUp className="w-8 h-8 text-white" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </GlassCard>
                </motion.div>,

                // Conversion Rate Card
                <motion.div
                  key="conversion"
                  variants={cardVariants}
                  whileHover="hover"
                  className="group"
                  data-testid="kpi-conversion"
                >
                  <GlassCard className="p-6 relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-200/20 group-hover:shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-500">
                    {/* Animated background overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    {/* Floating particles */}
                    <motion.div
                      className="absolute top-3 right-2 w-1.5 h-1.5 bg-purple-400 rounded-full"
                      variants={{
                        ...floatingVariants,
                        animate: {
                          ...floatingVariants.animate,
                          transition: {
                            ...floatingVariants.animate.transition,
                            delay: 1.5
                          }
                        }
                      }}
                      initial="initial"
                      animate="animate"
                    />
                    <motion.div
                      className="absolute bottom-4 left-5 w-1 h-1 bg-purple-300 rounded-full opacity-60"
                      variants={{
                        ...floatingVariants,
                        animate: {
                          ...floatingVariants.animate,
                          transition: {
                            ...floatingVariants.animate.transition,
                            delay: 0.8
                          }
                        }
                      }}
                      initial="initial"
                      animate="animate"
                    />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">
                          {t('admin.dashboard.conversionRate')}
                        </p>
                        <motion.p 
                          variants={numberVariants}
                          className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
                        >
                          {stats?.today && stats?.total ? 
                            `${((stats.today / stats.total) * 100).toFixed(1)}%` : "0%"
                          }
                        </motion.p>
                        <p className="text-xs text-purple-600/70">Taux de conversion</p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300"
                      >
                        <motion.div
                          variants={{
                            ...pulseVariants,
                            animate: {
                              ...pulseVariants.animate,
                              transition: {
                                ...pulseVariants.animate.transition,
                                delay: 1.5
                              }
                            }
                          }}
                          initial="initial"
                          animate="animate"
                        >
                          <Target className="w-8 h-8 text-white" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </GlassCard>
                </motion.div>
              ]
            )}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Charts Section */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Course Distribution Chart */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -5 }}
            data-testid="chart-courses"
          >
            <GlassCard className="p-8 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border-indigo-200/20 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg"
                  >
                    <BarChart3 className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                    {t('admin.dashboard.courseDistribution')}
                  </h3>
                </div>
              </div>
              <AnimatePresence>
                {statsLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-80 flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-500 rounded-full"
                      />
                      <p className="text-sm text-muted-foreground">Chargement des données...</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={stats?.courseDistribution || []} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#6366F1" stopOpacity={0.6}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                        <XAxis 
                          dataKey="course" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={11}
                          stroke="#6B7280"
                        />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(10px)'
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="url(#barGradient)"
                          radius={[4, 4, 0, 0]}
                          stroke="#4F46E5"
                          strokeWidth={1}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>

          {/* Wilaya Distribution Pie Chart */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -5 }}
            data-testid="chart-wilayas"
          >
            <GlassCard className="p-8 bg-gradient-to-br from-purple-50/50 to-pink-50/50 border-purple-200/20 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg"
                  >
                    <PieChart className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    {t('admin.dashboard.wilayaDistribution')}
                  </h3>
                </div>
              </div>
              <AnimatePresence>
                {statsLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-80 flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-3 border-purple-200 border-t-purple-500 rounded-full"
                      />
                      <p className="text-sm text-muted-foreground">Chargement des données...</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <ResponsiveContainer width="100%" height={320}>
                      <RechartsPieChart>
                        <defs>
                          {COLORS.map((color, index) => (
                            <linearGradient key={`gradient-${index}`} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                              <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
                            </linearGradient>
                          ))}
                        </defs>
                        <Pie
                          dataKey="count"
                          data={stats?.wilayaDistribution?.slice(0, 5) || []}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={40}
                          paddingAngle={5}
                          startAngle={90}
                          endAngle={450}
                        >
                          {(stats?.wilayaDistribution?.slice(0, 5) || []).map((entry: any, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#pieGradient${index})`}
                              stroke={COLORS[index % COLORS.length]}
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(10px)'
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Enhanced Daily Signups Chart */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -5 }}
        >
          <GlassCard className="p-8 mb-12 bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-green-200/20" data-testid="chart-daily">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg"
                >
                  <Activity className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  {t('admin.dashboard.dailySignups')}
                </h3>
              </div>
            </div>
            <AnimatePresence>
              {statsLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-80 flex items-center justify-center"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-3 border-green-200 border-t-green-500 rounded-full"
                    />
                    <p className="text-sm text-muted-foreground">Chargement des données...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={stats?.dailySignups || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="100%" stopColor="#10B981" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6B7280" 
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        fill="url(#areaGradient)"
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>

        {/* Enhanced Applicants Table */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -5 }}
        >
          <GlassCard className="p-8 bg-gradient-to-br from-slate-50/50 to-gray-50/50 border-slate-200/20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg"
                >
                  <Users className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                  {t('admin.dashboard.applicants')}
                </h3>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  data-testid="button-export"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('admin.dashboard.export')}
                </Button>
              </motion.div>
            </div>

            {/* Enhanced Filters */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8"
            >
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder={t('admin.dashboard.search')}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  data-testid="input-search"
                />
              </div>

              <Select value={filters.wilaya || 'all-wilayas'} onValueChange={(value) => handleFilterChange('wilaya', value || '')}>
                <SelectTrigger className="border-slate-200 focus:border-blue-500 transition-all duration-200" data-testid="select-wilaya">
                  <SelectValue placeholder={t('admin.dashboard.allWilayas')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-wilayas">{t('admin.dashboard.allWilayas')}</SelectItem>
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

              <Select value={filters.ageGroup || 'all-ages'} onValueChange={(value) => handleFilterChange('ageGroup', value || '')}>
                <SelectTrigger className="border-slate-200 focus:border-blue-500 transition-all duration-200" data-testid="select-age-group">
                  <SelectValue placeholder={t('admin.dashboard.allAges')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-ages">{t('admin.dashboard.allAges')}</SelectItem>
                  <SelectItem value="kids">{t('admin.dashboard.kids')}</SelectItem>
                  <SelectItem value="adults">{t('admin.dashboard.adults')}</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="Date début"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="border-slate-200 focus:border-blue-500 transition-all duration-200"
                data-testid="input-date-from"
              />

              <Input
                type="date"
                placeholder="Date fin"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="border-slate-200 focus:border-blue-500 transition-all duration-200"
                data-testid="input-date-to"
              />

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      search: "",
                      wilaya: "",
                      course: "",
                      ageGroup: "",
                      dateFrom: "",
                      dateTo: ""
                    });
                    setPage(0);
                  }}
                  className="w-full border-slate-200 hover:bg-slate-50 transition-all duration-200"
                  data-testid="button-clear-filters"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Effacer
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Table */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="overflow-x-auto rounded-xl border border-slate-200/50"
            >
              <AnimatePresence>
                {applicantsLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-64 flex items-center justify-center bg-white/50 backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-3 border-slate-200 border-t-slate-500 rounded-full"
                      />
                      <p className="text-sm text-muted-foreground">Chargement des candidatures...</p>
                    </div>
                  </motion.div>
                ) : (
                  <Table data-testid="applicants-table" className="bg-white/80 backdrop-blur-sm">
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                        {[
                          'Nom & Prénom', 'Email', 'Âge', 'Wilaya', 'Formation', 'Date', 'Statut', 'Actions'
                        ].map((header, index) => (
                          <motion.th
                            key={header}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="font-semibold text-slate-700 text-left p-4"
                          >
                            {header}
                          </motion.th>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {applicantsData?.applicants?.map((applicant: any, index: number) => (
                          <motion.tr
                            key={applicant.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="group hover:bg-blue-50/50 transition-all duration-200 border-b border-slate-100"
                            data-testid={`applicant-row-${applicant.id}`}
                          >
                            <TableCell className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                              {applicant.fullName}
                            </TableCell>
                            <TableCell className="text-slate-600 group-hover:text-slate-800 transition-colors">
                              {applicant.email}
                            </TableCell>
                            <TableCell className="text-slate-600 group-hover:text-slate-800 transition-colors">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {applicant.age} ans
                              </span>
                            </TableCell>
                            <TableCell className="text-slate-600 group-hover:text-slate-800 transition-colors">
                              {applicant.wilaya}
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <span 
                                className="truncate block text-slate-600 group-hover:text-slate-800 transition-colors" 
                                title={applicant.course}
                              >
                                {applicant.course}
                              </span>
                            </TableCell>
                            <TableCell className="text-slate-600 group-hover:text-slate-800 transition-colors">
                              {new Date(applicant.createdAt).toLocaleDateString('fr-FR')}
                            </TableCell>
                            <TableCell>
                              <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.05 + 0.1 }}
                              >
                                <Badge 
                                  variant={applicant.emailSent ? "default" : "secondary"}
                                  className={applicant.emailSent 
                                    ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                  }
                                >
                                  {applicant.emailSent ? "Email envoyé" : "En attente"}
                                </Badge>
                              </motion.div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <motion.div 
                                  whileHover={{ scale: 1.1 }} 
                                  whileTap={{ scale: 0.9 }}
                                  className="relative overflow-hidden rounded"
                                >
                                  <motion.div
                                    className="absolute inset-0 bg-blue-400/20 rounded"
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileTap={{ 
                                      scale: 2, 
                                      opacity: [0, 0.5, 0],
                                      transition: { duration: 0.4 } 
                                    }}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadPdf(applicant.applicationId)}
                                    className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 relative z-10"
                                    data-testid={`button-pdf-${applicant.id}`}
                                  >
                                    <motion.div
                                      whileHover={{ rotate: 15 }}
                                      transition={{ type: "spring", stiffness: 300 }}
                                    >
                                      <FileText className="w-4 h-4 text-blue-600" />
                                    </motion.div>
                                  </Button>
                                </motion.div>
                                <motion.div 
                                  whileHover={{ scale: 1.1 }} 
                                  whileTap={{ scale: 0.9 }}
                                  className="relative overflow-hidden rounded"
                                >
                                  <motion.div
                                    className="absolute inset-0 bg-green-400/20 rounded"
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileTap={{ 
                                      scale: 2, 
                                      opacity: [0, 0.5, 0],
                                      transition: { duration: 0.4 } 
                                    }}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => resendEmailMutation.mutate(applicant.id)}
                                    disabled={resendEmailMutation.isPending}
                                    className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200 disabled:opacity-50 relative z-10"
                                    data-testid={`button-email-${applicant.id}`}
                                  >
                                    <motion.div
                                      whileHover={{ rotate: -15 }}
                                      transition={{ type: "spring", stiffness: 300 }}
                                    >
                                      <Mail className="w-4 h-4 text-green-600" />
                                    </motion.div>
                                  </Button>
                                </motion.div>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Enhanced Pagination */}
            {applicantsData && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-between mt-8 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200/50"
              >
                <p className="text-sm text-slate-600 font-medium">
                  Affichage de <span className="font-bold text-blue-600">{page * pageSize + 1}</span> à{' '}
                  <span className="font-bold text-blue-600">{Math.min((page + 1) * pageSize, applicantsData.total)}</span> 
                  sur <span className="font-bold text-slate-800">{applicantsData.total}</span> résultats
                </p>
                <div className="flex space-x-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="border-slate-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      data-testid="button-prev-page"
                    >
                      Précédent
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={(page + 1) * pageSize >= applicantsData.total}
                      className="border-slate-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      data-testid="button-next-page"
                    >
                      Suivant
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
