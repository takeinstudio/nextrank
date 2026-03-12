import { motion } from 'framer-motion';
import { GraduationCap, Shield } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from '@/assets/logo.jpeg';

const LoginPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = params.get('role');

  if (role === 'admin') {
    navigate('/admin-login', { replace: true });
    return null;
  }
  if (role === 'student') {
    navigate('/student-login', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <img src={logo} alt="NXT Rank" className="w-16 h-16 rounded-full mx-auto mb-4" />
          <h1 className="text-2xl font-bold gradient-primary-text">Welcome to NXT RANK</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose how you want to continue</p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass-card-solid rounded-2xl p-6 hover-lift cursor-pointer"
            onClick={() => navigate('/student-login')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Continue as Student</h3>
                <p className="text-sm text-muted-foreground">Access lectures, tests & resources</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="glass-card-solid rounded-2xl p-6 hover-lift cursor-pointer"
            onClick={() => navigate('/admin-login')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
                <Shield className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Continue as Admin</h3>
                <p className="text-sm text-muted-foreground">Manage platform & students</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
