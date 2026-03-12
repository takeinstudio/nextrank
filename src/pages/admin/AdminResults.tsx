import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

interface TestAttempt {
  id: string;
  student_id: string;
  test_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  attempt_number: number;
  created_at: string;
  students: { name: string } | null;
  tests: { title: string } | null;
}

const AdminResults = () => {
  const [results, setResults] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: attempts, error: attemptsError } = await supabase
          .from('test_attempts')
          .select('id, student_id, test_id, score, total_questions, correct_answers, wrong_answers, attempt_number, created_at')
          .order('created_at', { ascending: false });

        if (attemptsError) {
          setError(attemptsError.message);
          return;
        }

        if (!attempts || attempts.length === 0) {
          setResults([]);
          return;
        }

        const studentIds = [...new Set(attempts.map(attempt => attempt.student_id).filter(Boolean))];
        const testIds = [...new Set(attempts.map(attempt => attempt.test_id).filter(Boolean))];

        const [studentsResponse, testsResponse] = await Promise.all([
          studentIds.length > 0
            ? supabase.from('students').select('id, name').in('id', studentIds)
            : Promise.resolve({ data: [], error: null }),
          testIds.length > 0
            ? supabase.from('tests').select('id, title').in('id', testIds)
            : Promise.resolve({ data: [], error: null }),
        ]);

        if (studentsResponse.error) {
          setError(studentsResponse.error.message);
          return;
        }

        if (testsResponse.error) {
          setError(testsResponse.error.message);
          return;
        }

        const studentsById = new Map((studentsResponse.data || []).map(student => [student.id, student]));
        const testsById = new Map((testsResponse.data || []).map(test => [test.id, test]));

        const joinedResults: TestAttempt[] = attempts.map(attempt => ({
          ...attempt,
          students: studentsById.get(attempt.student_id)
            ? { name: studentsById.get(attempt.student_id)!.name }
            : null,
          tests: testsById.get(attempt.test_id)
            ? { title: testsById.get(attempt.test_id)!.title }
            : null,
        }));

        setResults(joinedResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getGrade = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      time: 'short'
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Test Results</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
          Error: {error}
        </div>
      )}

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
                <th className="p-3">Grade</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-border/50">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={`cell-${j}`} className="p-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : results.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No results yet</td></tr>
              ) : (
                results.map(r => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-accent/50">
                    <td className="p-3 font-medium">{r.students?.name || 'Unknown'}</td>
                    <td className="p-3">{r.tests?.title || 'Unknown'}</td>
                    <td className="p-3 font-semibold">{r.score}/{r.total_questions}</td>
                    <td className="p-3 text-emerald-600">{r.correct_answers}</td>
                    <td className="p-3 text-destructive">{r.wrong_answers}</td>
                    <td className="p-3 font-semibold">{getGrade(r.score, r.total_questions)}</td>
                    <td className="p-3 text-xs text-muted-foreground">{formatDate(r.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminResults;
