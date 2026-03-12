import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getStudentSession } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Attempt {
  id: string;
  test_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  attempt_number: number;
  created_at: string;
  tests: { title: string; subject: string; class: number } | null;
}

const StudentResults = () => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const session = getStudentSession();
      if (!session) return;
      const { data } = await supabase
        .from('test_attempts')
        .select('*, tests(title, subject, class)')
        .eq('student_id', session.id)
        .order('created_at', { ascending: false });
      setAttempts((data as Attempt[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const pct = (a: Attempt) => Math.round((a.score / (a.total_questions || 1)) * 100);

  const grade = (p: number) => {
    if (p >= 90) return { label: 'Excellent', color: 'text-emerald-600' };
    if (p >= 75) return { label: 'Good', color: 'text-blue-600' };
    if (p >= 50) return { label: 'Average', color: 'text-amber-600' };
    return { label: 'Needs Work', color: 'text-destructive' };
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">My Results</h1>

      {loading && <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>}

      {!loading && attempts.length === 0 && (
        <div className="glass-card-solid rounded-2xl p-10 text-center">
          <Trophy className="mx-auto mb-3 text-muted-foreground" size={40} />
          <p className="text-muted-foreground text-sm">You haven't attempted any tests yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {attempts.map((attempt, index) => {
          const p = pct(attempt);
          const g = grade(p);
          return (
            <motion.div
              key={attempt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="glass-card-solid rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{attempt.tests?.title ?? 'Unknown Test'}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {attempt.tests?.subject} • Class {attempt.tests?.class} • Attempt #{attempt.attempt_number}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> {attempt.correct_answers} correct</span>
                    <span className="flex items-center gap-1"><XCircle size={12} className="text-destructive" /> {attempt.wrong_answers} wrong</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(attempt.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold gradient-primary-text">{attempt.score}/{attempt.total_questions}</p>
                  <p className={`text-xs font-medium mt-0.5 ${g.color}`}>{p}% — {g.label}</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full gradient-primary transition-all"
                  style={{ width: `${p}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentResults;
