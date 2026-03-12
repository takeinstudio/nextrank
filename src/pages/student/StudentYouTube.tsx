import { Youtube, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudentYouTube = () => (
  <div className="p-4 md:p-8 max-w-4xl">
    <h1 className="text-2xl font-bold mb-6">YouTube Lectures</h1>
    <div className="glass-card-solid rounded-2xl p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
        <Youtube className="text-red-500" size={32} />
      </div>
      <h3 className="text-xl font-bold mb-2">NXT Rank on YouTube</h3>
      <p className="text-sm text-muted-foreground mb-6">Watch free lectures and revision videos in Odia across all supported subjects.</p>
      <Button asChild className="gradient-primary text-primary-foreground rounded-xl">
        <a href="https://www.youtube.com/@nxt-rank" target="_blank" rel="noopener noreferrer">
          <Youtube size={18} className="mr-2" /> Open YouTube Channel <ExternalLink size={14} className="ml-2" />
        </a>
      </Button>
    </div>
  </div>
);

export default StudentYouTube;
