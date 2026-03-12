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
  aspectRatio: '1 / 1',
  backgroundImage: 'url(/ig.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
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
            whileHover={{ y: -6, rotateX: 6, rotateY: i % 2 === 0 ? -6 : 6, scale: 1.02 }}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/40 cursor-pointer [transform-style:preserve-3d] [perspective:1200px]"
            style={reelStyle}
          >
            {/* dark vignette — strong edges, clear centre */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_15%,rgba(0,0,0,0.30)_50%,rgba(0,0,0,0.72)_100%)]" />
            {/* bottom fade so text always pops */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center text-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white/90 bg-white/25 shadow-[0_4px_24px_rgba(0,0,0,0.55)] backdrop-blur-[2px] transition-transform group-hover:scale-110 group-hover:bg-white/40">
                <Play size={24} className="fill-white text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] ml-1" />
              </div>
              <Instagram size={20} className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">Watch Reel {i + 1}</span>
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
