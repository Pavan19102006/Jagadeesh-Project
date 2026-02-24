import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Briefcase, Clock, FileText, LayoutDashboard, Sparkles, ChevronDown, Star } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user) {
    return (
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">WorkStudy</span>
            </Link>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const isAdmin = user.role === 'ADMIN';
  const basePath = isAdmin ? '/admin' : '/student';

  const navItems = isAdmin
    ? [
      { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/jobs', label: 'Jobs', icon: Briefcase },
      { path: '/admin/applications', label: 'Applications', icon: FileText },
      { path: '/admin/workhours', label: 'Work Hours', icon: Clock },
    ]
    : [
      { path: '/student', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/student/jobs', label: 'Browse Jobs', icon: Briefcase },
      { path: '/student/applications', label: 'My Applications', icon: FileText },
      { path: '/student/workhours', label: 'Work Hours', icon: Clock },
    ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to={basePath} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">WorkStudy</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={`
                  relative px-4 py-2 text-sm font-medium transition-all duration-200
                  ${isActive(item.path)
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                )}
              </Button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Role Badge */}
            <div className={`
              hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
              ${isAdmin
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }
            `}>
              <Star className="w-3 h-3" />
              {isAdmin ? 'Admin' : 'Student'}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 px-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-white/50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-slate-800/95 backdrop-blur-xl border-white/10 text-white"
              >
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{user.fullName}</p>
                  <p className="text-xs text-white/50">{user.email}</p>
                </div>
                <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
