import { motion } from 'framer-motion';
import { Award, BookOpen } from 'lucide-react';

const FacultySection = () => (
  <section className="py-16 md:py-24 px-4 bg-card">
    <div className="container max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-primary-text">Meet Your Faculty</h2>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card-solid rounded-2xl p-8 max-w-lg mx-auto text-center hover-lift"
      >
        <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
          <img src="/faculty.jpeg" alt="Pruthwiraj Sir" className="w-full h-full object-cover" />
        </div>
        <h3 className="text-xl font-bold mb-1">Pruthwiraj Sir</h3>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><BookOpen size={14} /> Physics, Chemistry, Maths</span>
          <span className="flex items-center gap-1"><Award size={14} /> CHSE Expert</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          "Helping CHSE Odisha students understand concepts deeply and succeed in board examinations."
        </p>
      </motion.div>
    </div>
  </section>
);

export default FacultySection;
