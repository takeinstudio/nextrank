import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Home, Users, FileText, ClipboardList, Youtube, Instagram, User, LogOut, BookOpenText } from 'lucide-react';
import logo from '@/assets/logo.jpeg';

const navItems = [
  { path: '/student', icon: Home, label: 'Home' },
  { path: '/student/faculty', icon: Users, label: 'Faculty' },
  { path: '/student/resources', icon: FileText, label: 'Resources' },
  { path: '/student/question-banks', icon: BookOpenText, label: 'Q Banks' },
  { path: '/student/tests', icon: ClipboardList, label: 'Tests' },
  { path: '/student/youtube', icon: Youtube, label: 'YouTube' },
  { path: '/student/instagram', icon: Instagram, label: 'Instagram' },
  { path: '/student/profile', icon: User, label: 'Profile' },
];

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/student-login', { replace: true });
        return;
      }
      const { data } = await supabase.from('students').select('*').eq('id', session.user.id).maybeSingle();
      setStudent(data);
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col glass-card-solid border-r border-border z-40">
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <img src={logo} alt="NXT Rank" className="w-9 h-9 rounded-full" />
          <span className="font-bold gradient-primary-text">NXT RANK</span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                location.pathname === item.path ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-60 pb-20 md:pb-0 min-h-screen">
        <Outlet context={{ student }} />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card-solid border-t border-border z-40 flex gap-1 overflow-x-auto px-2 py-2">
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex min-w-[72px] flex-col items-center gap-0.5 px-2 py-1 text-[11px] ${
              location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default StudentLayout;
