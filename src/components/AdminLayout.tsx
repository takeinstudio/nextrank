import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, FileText, ClipboardList, BarChart3, Settings, LogOut } from 'lucide-react';
import logo from '@/assets/logo.jpeg';

const navItems = [
  { path: '/admin', icon: Home, label: 'Dashboard' },
  { path: '/admin/students', icon: Users, label: 'Students' },
  { path: '/admin/notes', icon: FileText, label: 'Upload Notes' },
  { path: '/admin/tests', icon: ClipboardList, label: 'Mock Tests' },
  { path: '/admin/results', icon: BarChart3, label: 'Results' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('nxtrank_admin') !== 'true') {
      navigate('/admin-login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('nxtrank_admin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col glass-card-solid border-r border-border z-40">
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <img src={logo} alt="NXT Rank" className="w-9 h-9 rounded-full" />
          <div>
            <span className="font-bold gradient-primary-text text-sm">NXT RANK</span>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
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

      {/* Mobile top bar */}
      <div className="md:hidden glass-card-solid border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src={logo} alt="NXT Rank" className="w-8 h-8 rounded-full" />
          <span className="font-bold text-sm gradient-primary-text">Admin</span>
        </div>
        <button onClick={handleLogout} className="text-destructive"><LogOut size={18} /></button>
      </div>

      <main className="md:ml-60 pb-20 md:pb-0 min-h-screen">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card-solid border-t border-border z-40 flex justify-around py-2">
        {navItems.slice(0, 5).map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs ${
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

export default AdminLayout;
