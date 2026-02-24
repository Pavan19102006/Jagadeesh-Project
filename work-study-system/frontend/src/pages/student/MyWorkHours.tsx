import { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { workHoursService, WorkHours, WorkHoursRequest } from '../../services/workHoursService';
import { jobService, JobPosting } from '../../services/jobService';
import { toast } from 'sonner';
import { Plus, Trash2, Clock } from 'lucide-react';

// Glassmorphism Card
const GlassCard = ({ children, className = '', hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
  <div className={`
    bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
    ${hover ? 'hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5' : ''}
    ${className}
  `}>
    {children}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    PENDING: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    APPROVED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    REJECTED: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
};

export default function MyWorkHours() {
  const [workHours, setWorkHours] = useState<WorkHours[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<WorkHoursRequest>({
    jobId: 0,
    workDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [hoursData, jobsData, totalData] = await Promise.all([
        workHoursService.getMyWorkHours(),
        jobService.getAllJobs(),
        workHoursService.getMyTotalHours(),
      ]);
      setWorkHours(hoursData);
      setJobs(jobsData);
      setTotalHours(totalData);
    } catch (error) {
      toast.error('Failed to load work hours');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await workHoursService.logWorkHours(formData);
      toast.success('Work hours logged successfully');
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to log work hours');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
      await workHoursService.deleteWorkHours(id);
      toast.success('Work hours deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete work hours');
    }
  };

  const resetForm = () => {
    setFormData({
      jobId: 0,
      workDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      description: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Work Hours</h1>
            <p className="text-white/60">
              Total approved hours: <span className="font-semibold text-cyan-400">{totalHours.toFixed(1)}</span>
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
              >
                <Plus className="h-5 w-5" />
                Log Hours
              </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800/95 backdrop-blur-xl border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Log Work Hours</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job" className="text-white/70">Job</Label>
                  <select
                    id="job"
                    className="w-full p-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    value={formData.jobId}
                    onChange={(e) => setFormData({ ...formData, jobId: parseInt(e.target.value) })}
                    required
                  >
                    <option value={0} className="bg-slate-800">Select a job</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id} className="bg-slate-800">{job.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workDate" className="text-white/70">Work Date</Label>
                  <Input
                    id="workDate"
                    type="date"
                    value={formData.workDate}
                    onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-white/70">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-white/70">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white/70">Description (Optional)</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What did you work on?"
                    rows={3}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/30 text-sm resize-none focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-white font-medium shadow-lg shadow-cyan-500/25 transition-all"
                >
                  Log Hours
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <p className="mt-4 text-white/50">Loading work hours...</p>
          </div>
        ) : workHours.length === 0 ? (
          <GlassCard className="p-12 text-center" hover={false}>
            <Clock className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-4">You haven't logged any work hours yet.</p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-white font-medium shadow-lg shadow-cyan-500/25 transition-all"
            >
              Log Your First Hours
            </button>
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden" hover={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/50 text-sm font-medium p-4">Job</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Date</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Time</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Hours</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Status</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workHours.map((entry) => (
                    <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-white font-medium">{entry.job.title}</td>
                      <td className="p-4 text-white/70">{new Date(entry.workDate).toLocaleDateString()}</td>
                      <td className="p-4 text-white/70">{entry.startTime} - {entry.endTime}</td>
                      <td className="p-4 text-cyan-400 font-medium">{entry.hoursWorked}</td>
                      <td className="p-4"><StatusBadge status={entry.status} /></td>
                      <td className="p-4">
                        {entry.status === 'PENDING' && (
                          <button onClick={() => handleDelete(entry.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
