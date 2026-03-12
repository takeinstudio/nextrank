import { Youtube, Instagram, BookOpen, ClipboardList, FileText, Home, BookOpenText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.jpeg';

const quickLinks = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Resources', href: '/student/resources', icon: FileText },
  { label: 'Mock Tests', href: '/student/tests', icon: ClipboardList },
  { label: 'Question Banks', href: '/student/question-banks', icon: BookOpenText },
  { label: 'YouTube Lectures', href: 'https://www.youtube.com/@nxt-rank', icon: BookOpen, external: true },
];

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="py-14 px-4 bg-slate-50 border-t border-slate-200">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="NXT Rank" className="w-11 h-11 rounded-full shadow" />
              <div>
                <h3 className="font-extrabold text-slate-800 text-base tracking-wide">NXT RANK</h3>
                <p className="text-xs text-slate-500">CHSE Odisha Online Learning</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Structured lectures, mock tests, notes&nbsp;&amp; question banks for CHSE students — in Odia.
            </p>
            <div className="flex gap-3 mt-1">
              <a
                href="https://www.youtube.com/@nxt-rank"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://www.instagram.com/nxt.rank"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 text-pink-500 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
                    >
                      <link.icon size={14} className="text-primary/60" />
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => navigate(link.href)}
                      className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
                    >
                      <link.icon size={14} className="text-primary/60" />
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Info */}
          <div>
            <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-widest">About</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>CHSE Odisha — Class 11 &amp; 12</li>
              <li>Physics · Chemistry · Mathematics</li>
              <li>Biology · IT (Java) · Odia · English</li>
              <li className="pt-2">
                <a href="https://www.instagram.com/nxt.rank" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@nxt.rank on Instagram</a>
              </li>
              <li>
                <a href="https://www.youtube.com/@nxt-rank" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">NXT Rank on YouTube</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} NXT Rank. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
