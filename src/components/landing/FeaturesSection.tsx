import { motion } from 'framer-motion';
import { Video, FileText, Brain, BarChart3, BookOpen, Rocket } from 'lucide-react';

const features = [
  { icon: Video, title: 'Lecture Videos', desc: 'HD video lectures in Odia for deep understanding' },
  { icon: FileText, title: 'Downloadable Notes', desc: 'Well-structured PDF notes for revision' },
  { icon: Brain, title: 'Mock Tests', desc: 'Real exam-style tests with auto evaluation' },
  { icon: BarChart3, title: 'Performance Tracking', desc: 'Track your scores and improvement' },
  { icon: BookOpen, title: 'CHSE Pattern Questions', desc: 'Questions aligned with board exam pattern' },
  { icon: Rocket, title: 'Motivation & Growth', desc: 'Stay motivated with growth mindset content' },
];

const FeaturesSection = () => (
  <section className="py-16 md:py-24 px-4 bg-card">
    <div className="container max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-primary-text">Why NXT RANK?</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Everything you need to ace your CHSE exams</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-solid rounded-2xl p-6 hover-lift cursor-default"
          >
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
              <f.icon className="text-primary-foreground" size={22} />
            </div>
            <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
