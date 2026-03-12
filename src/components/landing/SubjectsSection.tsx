import { motion } from 'framer-motion';
import { SUBJECT_CARDS } from '@/lib/subjects';

const SubjectsSection = () => (
  <section className="py-16 md:py-24 px-4 gradient-bg">
    <div className="container max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-primary-text">Subjects We Cover</h2>
        <p className="text-muted-foreground">Comprehensive coverage for CHSE Odisha syllabus</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {SUBJECT_CARDS.map((subjectCard, index) => (
          <motion.div
            key={subjectCard.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className={`rounded-2xl p-8 text-center hover-lift cursor-default bg-gradient-to-br ${subjectCard.gradient} shadow-lg`}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <subjectCard.icon className="text-primary-foreground" size={30} />
            </div>
            <h3 className="text-xl font-bold text-primary-foreground mb-2">{subjectCard.name}</h3>
            <p className="text-sm text-primary-foreground/80">{subjectCard.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SubjectsSection;
