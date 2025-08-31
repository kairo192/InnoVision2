import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { Logo } from "@/components/ui/logo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/hooks/use-i18n";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { wilayas } from "@/lib/wilaya-data";
import { 
  Users, TrendingUp, Calendar, Download, Mail, FileText, Search, Filter, LogOut,
  PieChart, Activity, Target, BarChart3, Zap, Settings, Bell, Star, Award,
  Clock, MapPin, GraduationCap, Shield, Wifi, WifiOff
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const COLORS = ['#0F4C81', '#35A7FF', '#FFC93C', '#0B2B43', '#87CEEB'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
  hover: { y: -5, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }
};

const numberVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.5 } }
};

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

const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="glass p-6 rounded-xl overflow-hidden relative"
  >
    <div className="flex items-center justify-between">
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState({
    search: "", wilaya: "", course: "", ageGroup: "", dateFrom: "", dateTo: ""
  });
  const [page, setPage] = useState(0);
  const [isRealTime, setIsRealTime] = useState(true);
  const [selectedView, setSelectedView] = useState("overview");
  const pageSize = 20;
  const { toast } = useToast();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const { data: user, isLoading: authLoading, error: authError } = useQuery<{
    id: string; email: string; role: string;
  }>({
    queryKey: ["/api/admin/me"],
    queryFn: getQueryFn({ on401: "returnNull" })
  });

  useEffect(() => {
    if (!authLoading && (!user || authError)) {
      setLocation("/admin/login");
    }
  }, [user, authLoading, authError, setLocation]);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<{
    total: number; today: number; thisMonth: number; growth: number; conversionRate: number;
    avgAge: number; topCourse: string; courseDistribution: { course: string; count: number }[];
    wilayaDistribution: { wilaya: string; count: number }[]; dailySignups: { date: string; count: number }[];
  }>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user,
    refetchInterval: isRealTime ? 30000 : false
  });

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

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/logout"),
    onSuccess: () => {
      queryClient.clear();
      setLocation("/admin/login");
    }
  });

  const resendEmailMutation = useMutation({
    mutationFn: (applicantId: string) => 
      apiRequest("POST", `/api/admin/applicants/${applicantId}/resend-email`),
    onSuccess: () => {
      toast({ title: "Email envoyé", description: t('admin.dashboard.emailSent') });
    }
  });

  const { data: systemStatus } = useQuery<{
    database: "healthy" | "warning" | "error";
    email: "healthy" | "warning" | "error";
    api: "healthy" | "warning" | "error";
  }>({
    queryKey: ["/api/admin/system-status"],
    enabled: !!user,
    refetchInterval: 60000
  });

  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => refetchStats(), 30000);
      return () => clearInterval(interval);
    }
  }, [isRealTime, refetchStats]);

  const handleFilterChange = (key: string, value: string) => {
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
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4">
          <motion.div animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full" />
          <span className="font-medium">Chargement du tableau de bord...</span>
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" 
      data-testid="admin-dashboard">
      
      {/* Header */}
      <motion.header initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo size="sm" />
              <div>
                <h1 className="text-2xl font-bold" data-testid="dashboard-title">
                  {t('admin.dashboard.title')}
                </h1>
                <p className="text-primary-foreground/80 text-sm">Centre de contrôle InnoVision</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus?.database === 'healthy' ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className="text-xs text-white/80">Système</span>
              </div>
              <div className="flex items-center space-x-2">
                {isRealTime ? <Wifi className="w-4 h-4 text-green-300" /> : <WifiOff className="w-4 h-4 text-gray-400" />}
                <Switch checked={isRealTime} onCheckedChange={setIsRealTime} className="scale-75" />
                <span className="text-xs text-white/80">Temps réel</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-foreground/80">Bienvenue,</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()}
                className="border-white/20 text-white hover:bg-white/10" data-testid="button-logout">
                <LogOut className="w-4 h-4 mr-2" />
                {t('admin.dashboard.logout')}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="overview"><Activity className="w-4 h-4 mr-2" />Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="w-4 h-4 mr-2" />Analytiques</TabsTrigger>
            <TabsTrigger value="applicants"><Users className="w-4 h-4 mr-2" />Candidats</TabsTrigger>
            <TabsTrigger value="reports"><FileText className="w-4 h-4 mr-2" />Rapports</TabsTrigger>
            <TabsTrigger value="settings" className="hidden lg:flex"><Settings className="w-4 h-4 mr-2" />Paramètres</TabsTrigger>
            <TabsTrigger value="system" className="hidden lg:flex"><Shield className="w-4 h-4 mr-2" />Système</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-8">
            {/* KPI Cards */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {statsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                  <>
                    {/* Total Applicants */}
                    <motion.div variants={cardVariants} whileHover="hover" data-testid="kpi-total">
                      <GlassCard className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/20">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">{t('admin.dashboard.totalApplicants')}</p>
                            <motion.p variants={numberVariants} className="text-3xl font-bold text-blue-600">
                              <AnimatedCounter value={stats?.total || 0} />
                            </motion.p>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600">+{stats?.growth || 0}%</span>
                            </div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>

                    {/* Today's Applicants */}
                    <motion.div variants={cardVariants} whileHover="hover" data-testid="kpi-today">
                      <GlassCard className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-600/20">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                            <motion.p variants={numberVariants} className="text-3xl font-bold text-cyan-600">
                              <AnimatedCounter value={stats?.today || 0} />
                            </motion.p>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3 h-3 text-cyan-500" />
                              <span className="text-xs text-cyan-600">Dernières 24h</span>
                            </div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl">
                            <Calendar className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>

                    {/* This Month */}
                    <motion.div variants={cardVariants} whileHover="hover" data-testid="kpi-month">
                      <GlassCard className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/20">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Ce mois</p>
                            <motion.p variants={numberVariants} className="text-3xl font-bold text-purple-600">
                              <AnimatedCounter value={stats?.thisMonth || 0} />
                            </motion.p>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600">+{stats?.growth || 0}%</span>
                            </div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                            <BarChart3 className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>

                    {/* Average Age */}
                    <motion.div variants={cardVariants} whileHover="hover">
                      <GlassCard className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/20">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Âge moyen</p>
                            <motion.p variants={numberVariants} className="text-3xl font-bold text-green-600">
                              <AnimatedCounter value={stats?.avgAge || 0} /> ans
                            </motion.p>
                            <div className="flex items-center space-x-2">
                              <Users className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600">Candidats</span>
                            </div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                            <Target className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>

                    {/* Top Course */}
                    <motion.div variants={cardVariants} whileHover="hover">
                      <GlassCard className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/20">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Cours populaire</p>
                            <p className="text-lg font-bold text-yellow-600 truncate">
                              {stats?.topCourse || 'N/A'}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-yellow-600">Plus demandé</span>
                            </div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                            <GraduationCap className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>

                    {/* Conversion Rate */}
                    <motion.div variants={cardVariants} whileHover="hover">
                      <GlassCard className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/20">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Taux de conversion</p>
                            <motion.p variants={numberVariants} className="text-3xl font-bold text-red-600">
                              <AnimatedCounter value={stats?.conversionRate || 0} />%
                            </motion.p>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600">Performant</span>
                            </div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                            <Award className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Charts Section */}
            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Course Distribution */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  {t('admin.dashboard.courseDistribution')}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats?.courseDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="course" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0F4C81" />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              {/* Wilaya Distribution */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {t('admin.dashboard.wilayaDistribution')}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={stats?.wilayaDistribution?.slice(0, 5) || []}
                      cx="50%" cy="50%" outerRadius={100} dataKey="count"
                    >
                      {(stats?.wilayaDistribution?.slice(0, 5) || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>

            {/* Daily Signups Chart */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                {t('admin.dashboard.dailySignups')}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats?.dailySignups || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="analytics" className="space-y-8 mt-8">
            <div className="text-center py-16">
              <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">Analytiques avancées</h3>
              <p className="text-muted-foreground">Analyses détaillées des données d'inscription</p>
            </div>
          </TabsContent>

          <TabsContent value="applicants" className="space-y-8 mt-8">
            {/* Applicants Header */}
            <div className="flex items-center justify-between">
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
                  Clear
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
                      <p className="text-sm text-muted-foreground">Loading applications...</p>
                    </div>
                  </motion.div>
                ) : (
                  <Table data-testid="applicants-table" className="bg-white/80 backdrop-blur-sm">
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                        {[
                          'Full Name', 'Email', 'Age', 'Wilaya', 'Course', 'Date', 'Status', 'Actions'
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
                                {applicant.age} years
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
                              {new Date(applicant.createdAt).toLocaleDateString('en-US')}
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
                                  {applicant.emailSent ? "Email Sent" : "Pending"}
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
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadPdf(applicant.applicationId)}
                                    className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                                    data-testid={`button-pdf-${applicant.id}`}
                                  >
                                    <FileText className="w-4 h-4 text-blue-600" />
                                  </Button>
                                </motion.div>
                                <motion.div 
                                  whileHover={{ scale: 1.1 }} 
                                  whileTap={{ scale: 0.9 }}
                                  className="relative overflow-hidden rounded"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => resendEmailMutation.mutate(applicant.id)}
                                    disabled={resendEmailMutation.isPending}
                                    className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200 disabled:opacity-50"
                                    data-testid={`button-email-${applicant.id}`}
                                  >
                                    <Mail className="w-4 h-4 text-green-600" />
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
                className="flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur-sm rounded-lg border border-slate-200/50"
              >
                <div className="text-sm text-slate-600">
                  Showing <span className="font-bold text-blue-600">{page * pageSize + 1}</span> to{' '}
                  <span className="font-bold text-blue-600">{Math.min((page + 1) * pageSize, applicantsData.total)}</span> 
                  of <span className="font-bold text-slate-800">{applicantsData.total}</span> results
                </div>
                <div className="flex space-x-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="border-slate-200 hover:bg-slate-50 transition-all duration-200"
                    >
                      Previous
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={(page + 1) * pageSize >= applicantsData.total}
                      className="border-slate-200 hover:bg-slate-50 transition-all duration-200"
                    >
                      Next
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-8 mt-8">
            <div className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">Rapports</h3>
              <p className="text-muted-foreground">Générez des rapports détaillés</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8 mt-8">
            <div className="text-center py-16">
              <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">Paramètres</h3>
              <p className="text-muted-foreground">Configuration du système</p>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-8 mt-8">
            <div className="text-center py-16">
              <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">Système</h3>
              <p className="text-muted-foreground">Surveillance et maintenance</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}