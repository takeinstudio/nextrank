import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const StudentTests = () => {
  const [tests, setTests] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
      setTests(data || []);
    };
    load();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Mock Tests</h1>
      {tests.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No tests available yet</p>
      ) : (
        <div className="space-y-3">
          {tests.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card-solid rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                    <ClipboardList className="text-primary-foreground" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{t.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      {t.subject} • Class {t.class} <Clock size={12} /> {t.duration} min
                    </p>
                  </div>
                </div>
                <Button size="sm" className="gradient-primary text-primary-foreground rounded-lg" onClick={() => navigate(`/student/exam/${t.id}`)}>
                  Start <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTests;
