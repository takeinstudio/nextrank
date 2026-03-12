import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const reels = [
  'DVyPftTiZ2l',
  'DVn43ZGCXgC',
  'DVvrSOuj1bm',
  'DVsUUg3ieD6',
];

const reelStyle: React.CSSProperties = {
  aspectRatio: (9 / 16).toString(),
  backgroundImage: 'url(/ig.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const InstagramSection = () => (
  <section className="py-16 md:py-24 px-4 bg-card">
    <div className="container max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-primary-text">Join Our Community</h2>
        <p className="text-muted-foreground">Follow us on Instagram for daily updates</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {reels.map((id, i) => (
          <motion.a
            key={id}
            href={"https://www.instagram.com/reel/" + id + "/"}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-xl overflow-hidden relative flex flex-col items-center justify-center hover-lift cursor-pointer"
            style={reelStyle}
          >
            <div className="absolute inset-0 backdrop-blur-sm bg-black/30 group-hover:bg-black/20 transition-colors" />
            <div className="relative z-10 flex flex-col items-center gap-3 text-white p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={22} className="text-white fill-white ml-1" />
              </div>
              <Instagram size={20} className="text-white/80" />
              <span className="text-xs font-medium text-white/90">Watch Reel {i + 1}</span>
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card-solid rounded-2xl p-6 md:p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
          <Instagram className="text-primary-foreground" size={28} />
        </div>
        <h3 className="text-xl font-bold mb-2">@nxt.rank</h3>
        <p className="text-sm text-muted-foreground mb-6">Daily tips, motivation, and study content for CHSE students</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="gradient-primary text-primary-foreground rounded-xl px-6">
            <a href="https://www.instagram.com/nxt.rank" target="_blank" rel="noopener noreferrer">
              <Instagram size={18} className="mr-2" /> Follow on Instagram
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-xl px-6 border-primary/30">
            <a href="https://www.instagram.com/nxt.rank" target="_blank" rel="noopener noreferrer">
              Open Instagram <ExternalLink size={14} className="ml-2" />
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default InstagramSection;
