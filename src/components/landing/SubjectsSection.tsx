import { motion } from 'framer-motion';
import { Atom, FlaskConical, Calculator } from 'lucide-react';

const subjects = [
  { icon: Atom, name: 'Physics', desc: 'Mechanics, Optics, Electromagnetism & more', gradient: 'from-sky-400 to-blue-500' },
  { icon: FlaskConical, name: 'Chemistry', desc: 'Organic, Inorganic & Physical Chemistry', gradient: 'from-emerald-400 to-teal-500' },
  { icon: Calculator, name: 'Mathematics', desc: 'Calculus, Algebra, Trigonometry & more', gradient: 'from-violet-400 to-indigo-500' },
];

const SubjectsSection = () => (
  <section className="py-16 md:py-24 px-4 gradient-bg">
    <div className="container max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-primary-text">Subjects We Cover</h2>
        <p className="text-muted-foreground">Comprehensive coverage for CHSE Odisha syllabus</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {subjects.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`rounded-2xl p-8 text-center hover-lift cursor-default bg-gradient-to-br ${s.gradient} shadow-lg`}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <s.icon className="text-primary-foreground" size={30} />
            </div>
            <h3 className="text-xl font-bold text-primary-foreground mb-2">{s.name}</h3>
            <p className="text-sm text-primary-foreground/80">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SubjectsSection;
