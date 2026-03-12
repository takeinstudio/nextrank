import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.jpeg';

interface PreloaderProps {
  isLoading: boolean;
}

const Preloader = ({ isLoading }: PreloaderProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gradient-bg"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full animate-pulse-glow flex items-center justify-center">
              <img src={logo} alt="NXT Rank" className="w-20 h-20 rounded-full object-cover" />
            </div>
            <svg className="absolute inset-0 w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(199 89% 48% / 0.2)" strokeWidth="3" />
              <motion.circle
                cx="50" cy="50" r="46" fill="none" stroke="hsl(199 89% 48%)" strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                style={{ strokeDasharray: "1 1" }}
              />
            </svg>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-2xl font-bold gradient-primary-text"
          >
            NXT RANK
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            Preparing Your Learning Experience...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
