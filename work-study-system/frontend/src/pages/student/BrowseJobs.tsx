import { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { jobService, JobPosting } from '../../services/jobService';
import { applicationService, ApplicationRequest } from '../../services/applicationService';
import { toast } from 'sonner';
import { MapPin, DollarSign, Clock, Users, Calendar, Briefcase, Send } from 'lucide-react';

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
    ACTIVE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    CLOSED: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    FILLED: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.ACTIVE}`}>
      {status}
    </span>
  );
};

export default function BrowseJobs() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobService.getActiveJobs();
      setJobs(data);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;

    setIsSubmitting(true);
    try {
      const request: ApplicationRequest = {
        jobId: selectedJob.id,
        coverLetter,
      };
      await applicationService.submitApplication(request);
      toast.success('Application submitted successfully!');
      setIsDialogOpen(false);
      setCoverLetter('');
      setSelectedJob(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openApplyDialog = (job: JobPosting) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Browse Jobs</h1>
          <p className="text-white/60">Find work-study opportunities that match your interests.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <p className="mt-4 text-white/50">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <GlassCard className="p-12 text-center" hover={false}>
            <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No jobs available at the moment.</p>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <GlassCard key={job.id} className="p-6 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                  <StatusBadge status={job.status} />
                </div>
                <p className="text-sm text-cyan-400 mb-3">{job.department}</p>
                <p className="text-white/60 text-sm mb-4 line-clamp-3 flex-1">{job.description}</p>

                <div className="space-y-2 text-sm mb-5">
                  <div className="flex items-center gap-2 text-white/50">
                    <MapPin className="h-4 w-4 text-white/30" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">${job.hourlyRate}/hour</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <Clock className="h-4 w-4 text-white/30" />
                    <span>Up to {job.maxHoursPerWeek} hours/week</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <Users className="h-4 w-4 text-white/30" />
                    <span>{job.filledPositions}/{job.totalPositions} positions filled</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <Calendar className="h-4 w-4 text-white/30" />
                    <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => openApplyDialog(job)}
                  disabled={job.status !== 'ACTIVE'}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Apply Now
                </button>
              </GlassCard>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-slate-800/95 backdrop-blur-xl border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Apply for Position</DialogTitle>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-4">
                <div>
                  <Label className="text-white/50 text-sm">Position</Label>
                  <p className="font-medium text-lg text-white">{selectedJob.title}</p>
                  <p className="text-sm text-cyan-400">{selectedJob.department}</p>
                </div>

                <div>
                  <Label htmlFor="coverLetter" className="text-white/70">Cover Letter</Label>
                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you're interested in this position and what makes you a good fit..."
                    rows={6}
                    className="w-full mt-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/30 text-sm resize-none focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium shadow-lg transition-all"
                    onClick={handleApply}
                    disabled={!coverLetter.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
