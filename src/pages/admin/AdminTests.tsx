import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, Save } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
import { SUBJECTS } from '@/lib/subjects';

type Test = Database['public']['Tables']['tests']['Row'];

interface QuestionForm {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

const emptyQ: QuestionForm = { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: '' };

const AdminTests = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [form, setForm] = useState({ title: '', subject: '', studentClass: '', duration: '30' });
  const [questions, setQuestions] = useState<QuestionForm[]>([{ ...emptyQ }]);
  const [saving, setSaving] = useState(false);

  const loadTests = async () => {
    const { data } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
    setTests(data || []);
  };

  useEffect(() => { loadTests(); }, []);

  const addQuestion = () => setQuestions(prev => [...prev, { ...emptyQ }]);
  const removeQuestion = (i: number) => setQuestions(prev => prev.filter((_, idx) => idx !== i));
  const updateQuestion = (i: number, field: keyof QuestionForm, value: string) => {
    setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.subject || !form.studentClass) {
      toast.error('Select subject, class, and enter a test title');
      return;
    }
    if (questions.some(q => !q.question_text || !q.correct_answer)) {
      toast.error('Fill all questions and select correct answers');
      return;
    }
    setSaving(true);

    const { data: test, error } = await supabase.from('tests').insert({
      title: form.title.trim(),
      subject: form.subject,
      class: parseInt(form.studentClass),
      duration: parseInt(form.duration),
    }).select().single();

    if (error || !test) { toast.error('Failed to create test'); setSaving(false); return; }

    const qs = questions.map(q => ({ ...q, test_id: test.id }));
    const { error: qError } = await supabase.from('questions').insert(qs);
    if (qError) { toast.error('Failed to add questions'); }
    else { toast.success('Test created!'); setForm({ title: '', subject: '', studentClass: '', duration: '30' }); setQuestions([{ ...emptyQ }]); loadTests(); }
    setSaving(false);
  };

  const deleteTest = async (id: string) => {
    await supabase.from('questions').delete().eq('test_id', id);
    await supabase.from('tests').delete().eq('id', id);
    toast.success('Test deleted');
    loadTests();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Create Mock Test</h1>
      <form onSubmit={handleCreate} className="glass-card-solid rounded-2xl p-6 space-y-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Test Title</Label>
            <Input placeholder="e.g. Biology Mock Test 1" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label>Subject</Label>
            <Select onValueChange={v => setForm(p => ({ ...p, subject: v }))} value={form.subject}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {SUBJECTS.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Class</Label>
            <Select onValueChange={v => setForm(p => ({ ...p, studentClass: v }))} value={form.studentClass}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="11">Class 11</SelectItem>
                <SelectItem value="12">Class 12</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Duration (minutes)</Label>
            <Input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} min={5} className="mt-1" />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Questions ({questions.length})</h3>
            <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addQuestion}>
              <Plus size={14} className="mr-1" /> Add Question
            </Button>
          </div>
          <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={i} className="bg-accent/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Q{i + 1}</span>
                  {questions.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => removeQuestion(i)}>
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
                <Textarea placeholder="Question text" value={q.question_text} onChange={e => updateQuestion(i, 'question_text', e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Option A" value={q.option_a} onChange={e => updateQuestion(i, 'option_a', e.target.value)} />
                  <Input placeholder="Option B" value={q.option_b} onChange={e => updateQuestion(i, 'option_b', e.target.value)} />
                  <Input placeholder="Option C" value={q.option_c} onChange={e => updateQuestion(i, 'option_c', e.target.value)} />
                  <Input placeholder="Option D" value={q.option_d} onChange={e => updateQuestion(i, 'option_d', e.target.value)} />
                </div>
                <Select onValueChange={v => updateQuestion(i, 'correct_answer', v)} value={q.correct_answer}>
                  <SelectTrigger><SelectValue placeholder="Correct answer" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="gradient-primary text-primary-foreground rounded-xl" disabled={saving}>
          <Save size={16} className="mr-2" /> {saving ? 'Creating...' : 'Create Test'}
        </Button>
      </form>

      <h2 className="text-lg font-semibold mb-3">Existing Tests</h2>
      <div className="space-y-2">
        {tests.map(t => (
          <div key={t.id} className="glass-card-solid rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{t.title}</p>
              <p className="text-xs text-muted-foreground">{t.subject} • Class {t.class} • {t.duration} min</p>
            </div>
            <Button size="sm" variant="outline" className="text-destructive rounded-lg" onClick={() => deleteTest(t.id)}>
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTests;
