import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, Calculator, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.jpeg';

const floatingIcons = [
  { Icon: BookOpen, x: '10%', y: '20%', delay: 0 },
  { Icon: FlaskConical, x: '80%', y: '15%', delay: 0.5 },
  { Icon: Calculator, x: '85%', y: '60%', delay: 1 },
  { Icon: GraduationCap, x: '5%', y: '65%', delay: 1.5 },
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg px-4">
      {floatingIcons.map(({ Icon, x, y, delay }, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:block text-primary/20"
          style={{ left: x, top: y }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay }}
        >
          <Icon size={40} />
        </motion.div>
      ))}

      <div className="container max-w-4xl text-center relative z-10 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <img src={logo} alt="NXT Rank" className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold gradient-primary-text mb-3"
        >
          NXT RANK
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl font-semibold text-secondary mb-4"
        >
          CHSE Online Teaching Platform
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed"
        >
          Learn Physics, Chemistry, and Mathematics in Odia with structured lectures, revision sessions, and mock tests designed for CHSE exam success.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 text-base px-8 py-6 rounded-xl glow-shadow" onClick={() => navigate('/login?role=student')}>
            Continue as Student
          </Button>
          <Button size="lg" variant="outline" className="border-primary/30 text-foreground hover:bg-primary/5 text-base px-8 py-6 rounded-xl" onClick={() => navigate('/login?role=admin')}>
            Continue as Admin
          </Button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full">
          <path d="M0,60 C360,100 720,0 1080,60 C1260,80 1380,40 1440,60 L1440,100 L0,100 Z" fill="hsl(0 0% 100% / 0.5)" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
