import { Youtube, Instagram } from 'lucide-react';
import logo from '@/assets/logo.jpeg';

const Footer = () => (
  <footer className="py-10 px-4 bg-foreground text-primary-foreground/70">
    <div className="container max-w-5xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="NXT Rank" className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-bold text-primary-foreground">NXT RANK</h3>
            <p className="text-xs">CHSE Odisha Online Learning</p>
          </div>
        </div>
        <div className="flex gap-4">
          <a href="https://www.youtube.com/@nxt-rank" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors"><Youtube size={20} /></a>
          <a href="https://www.instagram.com/nxt.rank" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors"><Instagram size={20} /></a>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-primary-foreground/10 text-center text-xs">
        © {new Date().getFullYear()} NXT Rank. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
