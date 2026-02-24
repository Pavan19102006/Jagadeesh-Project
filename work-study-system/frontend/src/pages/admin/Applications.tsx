import { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { applicationService, Application, ApplicationStatusRequest } from '../../services/applicationService';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye, FileText } from 'lucide-react';

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
    WITHDRAWN: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
};

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await applicationService.getAllApplications();
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      const request: ApplicationStatusRequest = {
        status,
        adminNotes,
      };
      await applicationService.updateApplicationStatus(id, request);
      toast.success(`Application ${status.toLowerCase()}`);
      setIsDialogOpen(false);
      setAdminNotes('');
      loadApplications();
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  const handleView = (application: Application) => {
    setSelectedApplication(application);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Applications</h1>
          <p className="text-white/60">Review and manage student applications</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="mt-4 text-white/50">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <GlassCard className="p-12 text-center" hover={false}>
            <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No applications received yet.</p>
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden" hover={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/50 text-sm font-medium p-4">Student</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Job</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Department</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Applied Date</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Status</th>
                    <th className="text-left text-white/50 text-sm font-medium p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-white font-medium">{app.student.fullName}</td>
                      <td className="p-4 text-white/70">{app.job.title}</td>
                      <td className="p-4 text-white/70">{app.job.department}</td>
                      <td className="p-4 text-white/70">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="p-4"><StatusBadge status={app.status} /></td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <button onClick={() => handleView(app)} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          {app.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleStatusUpdate(app.id, 'APPROVED')} className="p-2 rounded-lg hover:bg-emerald-500/10 text-white/50 hover:text-emerald-400 transition-colors">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} className="p-2 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors">
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
              <DialogTitle className="text-white">Application Details</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/50 text-sm">Student</Label>
                    <p className="font-medium text-white">{selectedApplication.student.fullName}</p>
                    <p className="text-sm text-white/50">{selectedApplication.student.email}</p>
                  </div>
                  <div>
                    <Label className="text-white/50 text-sm">Job Position</Label>
                    <p className="font-medium text-white">{selectedApplication.job.title}</p>
                    <p className="text-sm text-white/50">{selectedApplication.job.department}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-white/50 text-sm">Cover Letter</Label>
                  <p className="mt-1 p-3 bg-white/5 rounded-lg text-sm text-white/80 whitespace-pre-wrap border border-white/10">
                    {selectedApplication.coverLetter}
                  </p>
                </div>

                {selectedApplication.status === 'PENDING' && (
                  <div>
                    <Label htmlFor="adminNotes" className="text-white/70">Admin Notes</Label>
                    <textarea
                      id="adminNotes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about this application..."
                      rows={3}
                      className="w-full mt-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/30 text-sm resize-none focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                )}

                {selectedApplication.adminNotes && (
                  <div>
                    <Label className="text-white/50 text-sm">Previous Notes</Label>
                    <p className="mt-1 p-3 bg-white/5 rounded-lg text-sm text-white/80 border border-white/10">
                      {selectedApplication.adminNotes}
                    </p>
                  </div>
                )}

                {selectedApplication.status === 'PENDING' && (
                  <div className="flex gap-4">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 rounded-xl text-white font-medium shadow-lg transition-all"
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'APPROVED')}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 rounded-xl text-white font-medium shadow-lg transition-all"
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'REJECTED')}
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
