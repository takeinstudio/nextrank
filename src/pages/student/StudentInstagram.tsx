import { Instagram, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudentInstagram = () => (
  <div className="p-4 md:p-8 max-w-4xl">
    <h1 className="text-2xl font-bold mb-6">Instagram Community</h1>
    <div className="glass-card-solid rounded-2xl p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
        <Instagram className="text-primary-foreground" size={28} />
      </div>
      <h3 className="text-xl font-bold mb-2">@nxt.rank</h3>
      <p className="text-sm text-muted-foreground mb-6">Follow us for daily tips and study motivation</p>
      <Button asChild className="gradient-primary text-primary-foreground rounded-xl">
        <a href="https://www.instagram.com/nxt.rank" target="_blank" rel="noopener noreferrer">
          <Instagram size={18} className="mr-2" /> Follow on Instagram <ExternalLink size={14} className="ml-2" />
        </a>
      </Button>
    </div>
  </div>
);

export default StudentInstagram;
