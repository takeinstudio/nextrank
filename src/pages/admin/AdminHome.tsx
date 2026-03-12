import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, ClipboardList, FileText, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminHome = () => {
  const [stats, setStats] = useState({ students: 0, tests: 0, resources: 0, avgScore: 0 });

  useEffect(() => {
    const load = async () => {
      const { count: sc } = await supabase.from('students').select('*', { count: 'exact', head: true });
      const { count: tc } = await supabase.from('tests').select('*', { count: 'exact', head: true });
      const { count: rc } = await supabase.from('resources').select('*', { count: 'exact', head: true });
      const { data: attempts } = await supabase.from('test_attempts').select('score, total_questions');
      let avg = 0;
      if (attempts && attempts.length > 0) {
        const total = attempts.reduce((s, a) => s + (a.total_questions > 0 ? (a.score / a.total_questions) * 100 : 0), 0);
        avg = Math.round(total / attempts.length);
      }
      setStats({ students: sc || 0, tests: tc || 0, resources: rc || 0, avgScore: avg });
    };
    load();
  }, []);

  const cards = [
    { icon: Users, label: 'Total Students', value: stats.students, color: 'from-sky-400 to-blue-500' },
    { icon: ClipboardList, label: 'Total Tests', value: stats.tests, color: 'from-emerald-400 to-teal-500' },
    { icon: FileText, label: 'Resources', value: stats.resources, color: 'from-violet-400 to-indigo-500' },
    { icon: BarChart3, label: 'Avg Score', value: `${stats.avgScore}%`, color: 'from-amber-400 to-orange-500' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-5 bg-gradient-to-br ${c.color} shadow-lg`}>
            <c.icon className="text-primary-foreground mb-2" size={22} />
            <p className="text-2xl font-bold text-primary-foreground">{c.value}</p>
            <p className="text-xs text-primary-foreground/80">{c.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
