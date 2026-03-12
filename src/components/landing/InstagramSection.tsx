import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InstagramSection = () => (
  <section className="py-16 md:py-24 px-4 bg-card">
    <div className="container max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-primary-text">Join Our Community</h2>
        <p className="text-muted-foreground">Follow us on Instagram for daily updates</p>
      </motion.div>
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
