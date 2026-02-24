import { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { workHoursService, WorkHours, WorkHoursStatusRequest } from '../../services/workHoursService';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';

// Glassmorphism Card
const GlassCard = ({ children, className = '', hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
  <div className={`
    bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
    ${hover ? 'hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5' : ''}
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

export default function AdminWorkHours() {
  const [workHours, setWorkHours] = useState<WorkHours[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<WorkHours | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [supervisorNotes, setSupervisorNotes] = useState('');

  useEffect(() => {
    loadWorkHours();
  }, []);

  const loadWorkHours = async () => {
    try {
      const data = await workHoursService.getAllWorkHours();
      setWorkHours(data);
    } catch (error) {
      toast.error('Failed to load work hours');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      const request: WorkHoursStatusRequest = {
        status,
        supervisorNotes,
      };
      await workHoursService.updateWorkHoursStatus(id, request);
      toast.success(`Work hours ${status.toLowerCase()}`);
      setIsDialogOpen(false);
      setSupervisorNotes('');
      loadWorkHours();
    } catch (error) {
      toast.error('Failed to update work hours status');
    }
  };

  const handleView = (entry: WorkHours) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Work Hours</h1>
          <p className="text-white/60">Track and approve student work hours</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="mt-4 text-white/50">Loading work hours...</p>
          </div>
        ) : workHours.length === 0 ? (
          <GlassCard className="p-12 text-center" hover={false}>
            <Clock className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No work hours logged yet.</p>
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden" hover={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/50 text-sm font-medium p-4">Student</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Job</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Date</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Hours</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Status</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workHours.map((entry) => (
                    <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-white font-medium">{entry.student.fullName}</td>
                      <td className="p-4 text-white/70">{entry.job.title}</td>
                      <td className="p-4 text-white/70">{new Date(entry.workDate).toLocaleDateString()}</td>
                      <td className="p-4 text-purple-400 font-medium">{entry.hoursWorked}</td>
                      <td className="p-4"><StatusBadge status={entry.status} /></td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <button onClick={() => handleView(entry)} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          {entry.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleStatusUpdate(entry.id, 'APPROVED')} className="p-2 rounded-lg hover:bg-emerald-500/10 text-white/50 hover:text-emerald-400 transition-colors">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleStatusUpdate(entry.id, 'REJECTED')} className="p-2 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors">
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-slate-800/95 backdrop-blur-xl border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Work Hours Details</DialogTitle>
            </DialogHeader>
            {selectedEntry && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/50 text-sm">Student</Label>
                    <p className="font-medium text-white">{selectedEntry.student.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-white/50 text-sm">Job</Label>
                    <p className="font-medium text-white">{selectedEntry.job.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white/50 text-sm">Date</Label>
                    <p className="font-medium text-white">{new Date(selectedEntry.workDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-white/50 text-sm">Start Time</Label>
                    <p className="font-medium text-white">{selectedEntry.startTime}</p>
                  </div>
                  <div>
                    <Label className="text-white/50 text-sm">End Time</Label>
                    <p className="font-medium text-white">{selectedEntry.endTime}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-white/50 text-sm">Hours Worked</Label>
                  <p className="font-medium text-lg text-purple-400">{selectedEntry.hoursWorked} hours</p>
                </div>

                {selectedEntry.description && (
                  <div>
                    <Label className="text-white/50 text-sm">Description</Label>
                    <p className="mt-1 p-3 bg-white/5 rounded-lg text-sm text-white/80 border border-white/10">
                      {selectedEntry.description}
                    </p>
                  </div>
                )}

                {selectedEntry.status === 'PENDING' && (
                  <div>
                    <Label htmlFor="supervisorNotes" className="text-white/70">Supervisor Notes</Label>
                    <textarea
                      id="supervisorNotes"
                      value={supervisorNotes}
                      onChange={(e) => setSupervisorNotes(e.target.value)}
                      placeholder="Add notes about these work hours..."
                      rows={3}
                      className="w-full mt-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/30 text-sm resize-none focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                )}

                {selectedEntry.supervisorNotes && (
                  <div>
                    <Label className="text-white/50 text-sm">Previous Notes</Label>
                    <p className="mt-1 p-3 bg-white/5 rounded-lg text-sm text-white/80 border border-white/10">
                      {selectedEntry.supervisorNotes}
                    </p>
                  </div>
                )}

                {selectedEntry.status === 'PENDING' && (
                  <div className="flex gap-4">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 rounded-xl text-white font-medium shadow-lg transition-all"
                      onClick={() => handleStatusUpdate(selectedEntry.id, 'APPROVED')}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 rounded-xl text-white font-medium shadow-lg transition-all"
                      onClick={() => handleStatusUpdate(selectedEntry.id, 'REJECTED')}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
