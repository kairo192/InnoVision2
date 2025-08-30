import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
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
  BarChart3,
  PieChart
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
  Line
} from "recharts";

const COLORS = ['#0F4C81', '#35A7FF', '#FFC93C', '#0B2B43', '#87CEEB'];

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
  const { data: user, isLoading: authLoading, error: authError } = useQuery({
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
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const downloadPdf = (applicationId: string) => {
    window.open(`/api/pdf/${applicationId}`, '_blank');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <BarChart3 className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold" data-testid="dashboard-title">
                {t('admin.dashboard.title')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Bienvenue, {user.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                className="border-white/20 text-white hover:bg-white/10"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-1" />
                {t('admin.dashboard.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6" data-testid="kpi-total">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.dashboard.totalApplicants')}</p>
                <p className="text-2xl font-bold text-primary">
                  {statsLoading ? "..." : stats?.total || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </GlassCard>

          <GlassCard className="p-6" data-testid="kpi-today">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.dashboard.todayApplicants')}</p>
                <p className="text-2xl font-bold text-secondary">
                  {statsLoading ? "..." : stats?.today || 0}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-secondary" />
            </div>
          </GlassCard>

          <GlassCard className="p-6" data-testid="kpi-week">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.dashboard.weekApplicants')}</p>
                <p className="text-2xl font-bold text-accent">
                  {statsLoading ? "..." : stats?.thisWeek || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </GlassCard>

          <GlassCard className="p-6" data-testid="kpi-conversion">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.dashboard.conversionRate')}</p>
                <p className="text-2xl font-bold text-primary">
                  {statsLoading ? "..." : stats?.today && stats?.total ? 
                    `${((stats.today / stats.total) * 100).toFixed(1)}%` : "0%"
                  }
                </p>
              </div>
              <PieChart className="w-8 h-8 text-primary" />
            </div>
          </GlassCard>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Course Distribution */}
          <GlassCard className="p-6" data-testid="chart-courses">
            <h3 className="text-lg font-semibold text-primary mb-4">
              {t('admin.dashboard.courseDistribution')}
            </h3>
            {statsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.courseDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="course" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0F4C81" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          {/* Wilaya Distribution */}
          <GlassCard className="p-6" data-testid="chart-wilayas">
            <h3 className="text-lg font-semibold text-primary mb-4">
              {t('admin.dashboard.wilayaDistribution')}
            </h3>
            {statsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    dataKey="count"
                    data={stats?.wilayaDistribution?.slice(0, 5) || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ wilaya, count }: { wilaya: string; count: number }) => `${wilaya}: ${count}`}
                  >
                    {(stats?.wilayaDistribution?.slice(0, 5) || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </GlassCard>
        </div>

        {/* Daily Signups Chart */}
        <GlassCard className="p-6 mb-8" data-testid="chart-daily">
          <h3 className="text-lg font-semibold text-primary mb-4">
            {t('admin.dashboard.dailySignups')}
          </h3>
          {statsLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.dailySignups || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#35A7FF" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        {/* Applicants Table */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">
              {t('admin.dashboard.applicants')}
            </h3>
            <Button variant="outline" size="sm" data-testid="button-export">
              <Download className="w-4 h-4 mr-2" />
              {t('admin.dashboard.export')}
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('admin.dashboard.search')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            <Select value={filters.wilaya} onValueChange={(value) => handleFilterChange('wilaya', value)}>
              <SelectTrigger data-testid="select-wilaya">
                <SelectValue placeholder={t('admin.dashboard.allWilayas')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('admin.dashboard.allWilayas')}</SelectItem>
                {wilayas.map((wilaya) => (
                  <SelectItem key={wilaya.name} value={wilaya.name}>
                    {wilaya.code} - {wilaya.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.ageGroup} onValueChange={(value) => handleFilterChange('ageGroup', value)}>
              <SelectTrigger data-testid="select-age-group">
                <SelectValue placeholder={t('admin.dashboard.allAges')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('admin.dashboard.allAges')}</SelectItem>
                <SelectItem value="kids">{t('admin.dashboard.kids')}</SelectItem>
                <SelectItem value="adults">{t('admin.dashboard.adults')}</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Date début"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              data-testid="input-date-from"
            />

            <Input
              type="date"
              placeholder="Date fin"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              data-testid="input-date-to"
            />

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
              data-testid="button-clear-filters"
            >
              <Filter className="w-4 h-4 mr-2" />
              Effacer
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {applicantsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table data-testid="applicants-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom & Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Âge</TableHead>
                    <TableHead>Wilaya</TableHead>
                    <TableHead>Formation</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicantsData?.applicants?.map((applicant: any) => (
                    <TableRow key={applicant.id} data-testid={`applicant-row-${applicant.id}`}>
                      <TableCell className="font-medium">{applicant.fullName}</TableCell>
                      <TableCell>{applicant.email}</TableCell>
                      <TableCell>{applicant.age} ans</TableCell>
                      <TableCell>{applicant.wilaya}</TableCell>
                      <TableCell className="max-w-xs truncate" title={applicant.course}>
                        {applicant.course}
                      </TableCell>
                      <TableCell>
                        {new Date(applicant.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={applicant.emailSent ? "default" : "secondary"}>
                          {applicant.emailSent ? "Email envoyé" : "En attente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadPdf(applicant.applicationId)}
                            data-testid={`button-pdf-${applicant.id}`}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resendEmailMutation.mutate(applicant.id)}
                            disabled={resendEmailMutation.isPending}
                            data-testid={`button-email-${applicant.id}`}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {applicantsData && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Affichage de {page * pageSize + 1} à {Math.min((page + 1) * pageSize, applicantsData.total)} sur {applicantsData.total} résultats
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  data-testid="button-prev-page"
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={(page + 1) * pageSize >= applicantsData.total}
                  data-testid="button-next-page"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
