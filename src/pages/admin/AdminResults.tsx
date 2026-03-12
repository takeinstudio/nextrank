import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AdminResults = () => {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('test_attempts')
        .select('*, students(name), tests(title)')
        .order('created_at', { ascending: false });
      setResults(data || []);
    };
    load();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Test Results</h1>
      <div className="glass-card-solid rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-3">Student</th>
                <th className="p-3">Test</th>
                <th className="p-3">Score</th>
                <th className="p-3">Correct</th>
                <th className="p-3">Wrong</th>
                <th className="p-3">Attempt</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-accent/50">
                  <td className="p-3 font-medium">{(r.students as any)?.name || 'Unknown'}</td>
                  <td className="p-3">{(r.tests as any)?.title || 'Unknown'}</td>
                  <td className="p-3 font-semibold">{r.score}/{r.total_questions}</td>
                  <td className="p-3 text-emerald-600">{r.correct_answers}</td>
                  <td className="p-3 text-destructive">{r.wrong_answers}</td>
                  <td className="p-3">#{r.attempt_number}</td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No results yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminResults;
