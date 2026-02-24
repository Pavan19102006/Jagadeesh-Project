import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, Clock, FileText, GraduationCap, Users, Sparkles, ArrowRight, Star, Zap } from 'lucide-react';
import { Scene3D } from '@/components/3d';

// Glass Card Component with stagger animation
const GlassCard = ({ children, className = '', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`
        relative backdrop-blur-xl bg-white/[0.06] 
        border border-white/[0.1] rounded-2xl overflow-hidden
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        hover:shadow-[0_16px_48px_rgba(0,200,255,0.1)]
        hover:bg-white/[0.08] hover:border-white/[0.15]
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}
      `}
    >
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </div>
  );
};

// Gradient text component
const GradientText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: Briefcase,
      title: 'Job Postings',
      description: 'Browse and apply for work-study positions across various departments.',
      gradient: 'from-cyan-400 to-blue-500',
    },
    {
      icon: FileText,
      title: 'Easy Applications',
      description: 'Submit applications with cover letters and track their status.',
      gradient: 'from-violet-400 to-purple-500',
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Log your work hours and get them approved by supervisors.',
      gradient: 'from-orange-400 to-pink-500',
    },
    {
      icon: GraduationCap,
      title: 'Performance Feedback',
      description: 'Receive valuable feedback on your work from supervisors.',
      gradient: 'from-green-400 to-emerald-500',
    },
    {
      icon: Users,
      title: 'Admin Tools',
      description: 'Manage job postings, applications, and student hours.',
      gradient: 'from-blue-400 to-indigo-500',
    },
    {
      icon: Zap,
      title: 'Instant Updates',
      description: 'Real-time notifications about applications and work hours.',
      gradient: 'from-pink-400 to-rose-500',
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Students', icon: '👨‍🎓' },
    { value: '150+', label: 'Job Positions', icon: '💼' },
    { value: '10K+', label: 'Hours Logged', icon: '⏱️' },
    { value: '98%', label: 'Satisfaction', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* 3D Scene Background */}
      <Scene3D />

      {/* Cursor glow */}
      <div
        className="fixed w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
          zIndex: 1,
          transition: 'left 0.15s ease-out, top 0.15s ease-out',
          filter: 'blur(30px)',
        }}
      />

      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300"
        style={{
          backgroundColor: scrollY > 50 ? 'rgba(10,10,26,0.8)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">WorkStudy<span className="text-cyan-400">.</span></span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl shadow-lg shadow-cyan-500/25"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 min-h-screen flex flex-col justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] backdrop-blur border border-white/10 mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-white/80">Trusted by 500+ students worldwide</span>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">
            <span className="inline-block animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Transform Your
            </span>
            <br />
            <span className="inline-block animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <GradientText>Work Experience</GradientText>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: '0.3s' }}>
            A next-generation platform connecting students with on-campus opportunities.
            Track hours, manage applications, and accelerate your career.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-lg px-8 py-6 rounded-xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
              onClick={() => navigate('/register')}
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-xl border-white/20 text-white hover:bg-white/10 backdrop-blur"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {stats.map((stat, index) => (
            <GlassCard key={index} className="p-6 text-center" delay={500 + index * 100}>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold mb-1">
                <GradientText>{stat.value}</GradientText>
              </div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white/70">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to <GradientText>Succeed</GradientText>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Comprehensive tools designed to streamline your work-study experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <GlassCard key={index} className="p-8 group cursor-pointer" delay={index * 80}>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-cyan-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/50 leading-relaxed">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <GlassCard className="p-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to <GradientText>Get Started?</GradientText>
          </h2>
          <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
            Join thousands of students transforming their work-study experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-white/90 text-lg px-8 py-6 rounded-xl font-semibold shadow-xl"
              onClick={() => navigate('/register')}
            >
              Create Free Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-xl border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              Learn More
            </Button>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/40 text-sm">
          © 2024 WorkStudy Program Management System. Built with ❤️ for students.
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
