import { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { feedbackService, Feedback } from '../../services/feedbackService';
import { toast } from 'sonner';
import { Star, Briefcase, Calendar, MessageSquare } from 'lucide-react';

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

export default function MyFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await feedbackService.getMyFeedback();
      setFeedback(data);
    } catch (error) {
      toast.error('Failed to load feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Feedback</h1>
          <p className="text-white/60">View feedback from your supervisors on your work performance.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <p className="mt-4 text-white/50">Loading feedback...</p>
          </div>
        ) : feedback.length === 0 ? (
          <GlassCard className="p-12 text-center" hover={false}>
            <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">You haven't received any feedback yet.</p>
            <p className="text-sm text-white/40 mt-2">
              Feedback will appear here once your supervisors review your work.
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            {feedback.map((item) => (
              <GlassCard key={item.id} className="p-6" hover={false}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{item.job.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-white/50 mb-1">Rating</p>
                      {renderStars(item.rating)}
                    </div>

                    <div>
                      <p className="text-sm text-white/50 mb-1">Comments</p>
                      <p className="text-white/80 whitespace-pre-wrap">{item.comments}</p>
                    </div>

                    {item.performanceAreas && (
                      <div className="mt-4">
                        <p className="text-sm text-white/50 mb-2">Performance Areas</p>
                        <div className="flex flex-wrap gap-2">
                          {item.performanceAreas.split(',').map((area, idx) => (
                            <span key={idx} className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full text-xs font-medium">
                              {area.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-white/50">From</p>
                    <p className="font-medium text-white">{item.givenBy.fullName}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
