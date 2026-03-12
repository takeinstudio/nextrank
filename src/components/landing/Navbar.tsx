import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.jpeg';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Subjects', href: '#subjects' },
  { label: 'Faculty', href: '#faculty' },
  { label: 'YouTube', href: '#youtube' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide when scrolling down, show when scrolling up or at top
      if (currentScrollY <= 0) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 glass-card-solid border-b border-border transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="container max-w-6xl flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <img src={logo} alt="NXT Rank" className="w-9 h-9 rounded-full" />
          <span className="text-lg font-bold gradient-primary-text tracking-tight">NXT RANK</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <button key={l.label} onClick={() => scrollTo(l.href)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </button>
          ))}
          <Button size="sm" className="gradient-primary text-primary-foreground rounded-full px-5" onClick={() => navigate('/login')}>
            Get Started
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-card-solid border-t border-border px-4 pb-4 space-y-2">
          {navLinks.map(l => (
            <button key={l.label} onClick={() => scrollTo(l.href)} className="block w-full text-left py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              {l.label}
            </button>
          ))}
          <Button size="sm" className="w-full gradient-primary text-primary-foreground rounded-full" onClick={() => { setOpen(false); navigate('/login'); }}>
            Get Started
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
