import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { dashboardService, AdminDashboard as AdminDashboardData } from '../../services/dashboardService';
import { Users, Briefcase, FileText, Clock, ArrowRight, TrendingUp, Plus, Settings, BarChart3, Zap } from 'lucide-react';
import { toast } from 'sonner';

// Glassmorphism Card component
const GlassCard = ({ children, className = '', hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
  <div className={`
    bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
    ${hover ? 'hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5' : ''}
    ${className}
  `}>
    {children}
  </div>
);

// Stat Card with gradient icon
const StatCard = ({ title, value, icon: Icon, gradient, subtitle }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  subtitle?: string;
}) => (
  <GlassCard className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/50 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
        {subtitle && (
          <div className="flex items-center gap-1 mt-2 text-purple-400 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>{subtitle}</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </GlassCard>
);

// Quick Action Button
const QuickActionButton = ({ title, icon: Icon, onClick, gradient }: {
  title: string;
  icon: React.ElementType;
  onClick: () => void;
  gradient: string;
}) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
  >
    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{title}</span>
  </button>
);

// Management Card
const ManagementCard = ({ title, description, icon: Icon, path, count, gradient }: {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  count?: number;
  gradient: string;
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="group flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 w-full text-left"
    >
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-white group-hover:text-purple-400 transition-colors">{title}</p>
          {count !== undefined && (
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">{count}</span>
          )}
        </div>
        <p className="text-sm text-white/50 mt-1">{description}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
    </button>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await dashboardService.getAdminDashboard();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Students', value: stats?.totalStudents || 0, icon: Users, gradient: 'from-blue-500 to-cyan-400', subtitle: 'Active users' },
    { title: 'Active Jobs', value: stats?.activeJobs || 0, icon: Briefcase, gradient: 'from-emerald-500 to-green-400', subtitle: `${stats?.totalJobs || 0} total` },
    { title: 'Pending Applications', value: stats?.pendingApplications || 0, icon: FileText, gradient: 'from-amber-500 to-orange-400', subtitle: 'Needs review' },
    { title: 'Total Work Hours', value: stats?.totalWorkHours?.toFixed(1) || '0.0', icon: Clock, gradient: 'from-purple-500 to-pink-400' },
  ];

  const managementCards = [
    { title: 'Manage Jobs', description: 'Post, edit, and close job positions', icon: Briefcase, path: '/admin/jobs', gradient: 'from-emerald-500 to-green-500', count: stats?.activeJobs },
    { title: 'Review Applications', description: 'Approve or reject student applications', icon: FileText, path: '/admin/applications', gradient: 'from-amber-500 to-orange-500', count: stats?.pendingApplications },
    { title: 'Work Hours', description: 'Track and approve student work hours', icon: Clock, path: '/admin/workhours', gradient: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-white/60 text-lg">
              Manage your work-study program efficiently
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={() => navigate('/admin/jobs')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 rounded-xl text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="mt-4 text-white/50">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card, index) => (
                <StatCard key={index} {...card} />
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <GlassCard className="p-6" hover={false}>
                  <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-semibold text-white">Management</h2>
                  </div>
                  <div className="space-y-3">
                    {managementCards.map((card, index) => (
                      <ManagementCard key={index} {...card} />
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* System Overview */}
              <div>
                <GlassCard className="p-6" hover={false}>
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-semibold text-white">System Overview</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-white/60">Total Jobs Posted</span>
                      <span className="text-white font-semibold">{stats?.totalJobs || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-white/60">Total Applications</span>
                      <span className="text-white font-semibold">{stats?.totalApplications || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-white/60">Job Fill Rate</span>
                      <span className="text-emerald-400 font-semibold">
                        {stats?.totalJobs ? Math.round((stats.activeJobs / stats.totalJobs) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-white/60">Pending Reviews</span>
                      <span className={`font-semibold ${(stats?.pendingApplications || 0) > 0 ? 'text-amber-400' : 'text-white'}`}>
                        {stats?.pendingApplications || 0}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-white/50 text-sm mb-4">Quick Actions</p>
                    <div className="grid grid-cols-3 gap-3">
                      <QuickActionButton
                        title="Jobs"
                        icon={Briefcase}
                        onClick={() => navigate('/admin/jobs')}
                        gradient="from-emerald-500 to-green-500"
                      />
                      <QuickActionButton
                        title="Apps"
                        icon={FileText}
                        onClick={() => navigate('/admin/applications')}
                        gradient="from-amber-500 to-orange-500"
                      />
                      <QuickActionButton
                        title="Hours"
                        icon={Clock}
                        onClick={() => navigate('/admin/workhours')}
                        gradient="from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
