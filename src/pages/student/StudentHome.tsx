import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getStudentSession } from '@/lib/auth';
import { BookOpen, ClipboardList, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentHome = () => {
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState({ tests: 0, resources: 0, attempts: 0 });

  useEffect(() => {
    const load = async () => {
      const session = getStudentSession();
      if (!session) return;
      setStudent(session);
      const { count: tc } = await supabase.from('tests').select('*', { count: 'exact', head: true });
      const { count: rc } = await supabase.from('resources').select('*', { count: 'exact', head: true });
      const { count: ac } = await supabase.from('test_attempts').select('*', { count: 'exact', head: true }).eq('student_id', session.id);
      setStats({ tests: tc || 0, resources: rc || 0, attempts: ac || 0 });
    };
    load();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">
          Welcome{student ? `, ${student.name}` : ''}! 👋
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {student ? `Class ${student.class} • CHSE Odisha` : 'Loading...'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: ClipboardList, label: 'Available Tests', value: stats.tests, color: 'from-sky-400 to-blue-500' },
          { icon: FileText, label: 'Resources', value: stats.resources, color: 'from-emerald-400 to-teal-500' },
          { icon: BookOpen, label: 'My Attempts', value: stats.attempts, color: 'from-violet-400 to-indigo-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-5 bg-gradient-to-br ${s.color} shadow-lg`}>
            <s.icon className="text-primary-foreground mb-2" size={24} />
            <p className="text-2xl font-bold text-primary-foreground">{s.value}</p>
            <p className="text-sm text-primary-foreground/80">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentHome;
