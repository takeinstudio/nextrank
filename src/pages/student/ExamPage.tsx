import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  image_url?: string;
}

const ExamPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/student-login'); return; }
      setStudentId(session.user.id);
      const { data: s } = await supabase.from('students').select('name').eq('id', session.user.id).maybeSingle();
      setStudentName(s?.name || 'Student');
      const { data: t } = await supabase.from('tests').select('*').eq('id', testId).maybeSingle();
      if (!t) { navigate('/student/tests'); return; }
      setTest(t);
      setTimeLeft(t.duration * 60);
      const { data: qs } = await supabase.from('questions').select('*').eq('test_id', testId).order('created_at');
      setQuestions(qs || []);
    };
    load();
  }, [testId, navigate]);

  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);
    let correct = 0;
    let wrong = 0;
    questions.forEach(q => {
      if (answers[q.id]) {
        if (answers[q.id] === q.correct_answer) correct++;
        else wrong++;
      }
    });
    const score = correct;
    const total = questions.length;

    // Get attempt number
    const { count } = await supabase.from('test_attempts').select('*', { count: 'exact', head: true })
      .eq('student_id', studentId).eq('test_id', testId!);
    const attemptNumber = (count || 0) + 1;

    // Save attempt
    const { data: attempt } = await supabase.from('test_attempts').insert({
      student_id: studentId,
      test_id: testId,
      score,
      total_questions: total,
      correct_answers: correct,
      wrong_answers: wrong,
      attempt_number: attemptNumber,
    }).select().single();

    // Save individual answers
    if (attempt) {
      const answerRows = questions.map(q => ({
        attempt_id: attempt.id,
        question_id: q.id,
        selected_answer: answers[q.id] || null,
        is_correct: answers[q.id] === q.correct_answer,
      }));
      await supabase.from('answers').insert(answerRows);
    }

    setResult({ score, total, correct, wrong, attemptNumber });
    toast.success('Test submitted!');
  }, [submitted, questions, answers, studentId, testId]);

  // Timer
  useEffect(() => {
    if (!test || submitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [test, submitted, handleSubmit]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (!test || questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading exam...</p></div>;
  }

  if (result) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
        <div className="glass-card-solid rounded-2xl p-8 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold mb-4 gradient-primary-text">Test Result</h2>
          <div className="text-5xl font-bold gradient-primary-text mb-2">{result.score}/{result.total}</div>
          <div className="space-y-2 text-sm mt-4 mb-6">
            <p className="text-emerald-600">✓ Correct: {result.correct}</p>
            <p className="text-destructive">✗ Wrong: {result.wrong}</p>
            <p className="text-muted-foreground">Attempt #{result.attemptNumber}</p>
          </div>
          <Button className="gradient-primary text-primary-foreground rounded-xl w-full" onClick={() => navigate('/student/tests')}>
            Back to Tests
          </Button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="glass-card-solid border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h2 className="font-semibold text-sm">{test.title}</h2>
          <p className="text-xs text-muted-foreground">{studentName}</p>
        </div>
        <div className={`font-mono font-bold text-lg ${timeLeft < 60 ? 'text-destructive' : 'text-primary'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Question panel */}
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-muted-foreground mb-2">Question {currentQ + 1} of {questions.length}</p>
            <h3 className="text-lg font-medium mb-6">{q.question_text}</h3>
            {q.image_url && <img src={q.image_url} alt="Question" className="max-w-full rounded-xl mb-6" />}
            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map(opt => {
                const optKey = `option_${opt.toLowerCase()}` as keyof Question;
                const selected = answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selected ? 'border-primary bg-primary/5 glow-shadow' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold mr-3 ${
                      selected ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>{opt}</span>
                    {q[optKey]}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="outline" className="rounded-xl" disabled={currentQ === 0} onClick={() => setCurrentQ(p => p - 1)}>Previous</Button>
              <Button variant="outline" className="rounded-xl" onClick={() => {
                setMarkedForReview(prev => {
                  const n = new Set(prev);
                  n.has(q.id) ? n.delete(q.id) : n.add(q.id);
                  return n;
                });
              }}>
                {markedForReview.has(q.id) ? 'Unmark' : 'Mark for Review'}
              </Button>
              {currentQ < questions.length - 1 ? (
                <Button className="gradient-primary text-primary-foreground rounded-xl ml-auto" onClick={() => setCurrentQ(p => p + 1)}>Next</Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="gradient-primary text-primary-foreground rounded-xl ml-auto">Submit</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit Test?</AlertDialogTitle>
                      <AlertDialogDescription>Are you sure you want to submit the test? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>

        {/* Question grid */}
        <div className="w-full md:w-56 p-4 border-t md:border-t-0 md:border-l border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-3">Questions</p>
          <div className="grid grid-cols-8 md:grid-cols-4 gap-2">
            {questions.map((qq, i) => {
              const answered = !!answers[qq.id];
              const marked = markedForReview.has(qq.id);
              return (
                <button
                  key={qq.id}
                  onClick={() => setCurrentQ(i)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                    i === currentQ ? 'ring-2 ring-primary' : ''
                  } ${marked ? 'bg-amber-400 text-foreground' : answered ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1 text-xs text-muted-foreground">
            <p><span className="inline-block w-3 h-3 rounded bg-muted mr-1" /> Not attempted</p>
            <p><span className="inline-block w-3 h-3 rounded gradient-primary mr-1" /> Attempted</p>
            <p><span className="inline-block w-3 h-3 rounded bg-amber-400 mr-1" /> Marked for review</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
