import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 md:py-24 px-4 gradient-bg">
      <div className="container max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="gradient-primary rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Start Learning?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">Join thousands of CHSE students who are already preparing smarter with NXT Rank.</p>
          <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl px-8 py-6 text-base font-semibold" onClick={() => navigate('/login?role=student')}>
            Get Started Now <ArrowRight size={18} className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
