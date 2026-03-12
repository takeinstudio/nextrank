import { motion } from 'framer-motion';
import { Youtube, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const videos = [
  'YANB2qJJ238',
  'uIcmL4uVtAQ',
  'wOQKWW4HvKc',
  'x5aNNszY-g4',
];

const YouTubeSection = () => (
  <section className="py-16 md:py-24 px-4 gradient-bg">
    <div className="container max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-primary-text">YouTube Lectures</h2>
        <p className="text-muted-foreground">Free video lectures on our YouTube channel</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {videos.map((id, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl overflow-hidden aspect-video"
          >
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              title={`NXT Rank lecture ${i + 1}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card-solid rounded-2xl p-6 md:p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <Youtube className="text-red-500" size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">NXT Rank on YouTube</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">Watch our latest physics, chemistry and mathematics lectures completely free in Odia language.</p>
        <Button asChild className="gradient-primary text-primary-foreground rounded-xl px-6">
          <a href="https://www.youtube.com/@nxt-rank" target="_blank" rel="noopener noreferrer">
            <Youtube size={18} className="mr-2" /> Visit Channel <ExternalLink size={14} className="ml-2" />
          </a>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default YouTubeSection;
