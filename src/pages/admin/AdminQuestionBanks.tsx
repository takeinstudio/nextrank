import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BookOpenText, Trash2, Upload } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
import { SUBJECTS } from '@/lib/subjects';
import {
  buildQuestionBankStoragePath,
  extractQuestionBankStoragePath,
  QUESTION_BANKS_BUCKET,
} from '@/lib/storage';

type QuestionBank = Database['public']['Tables']['question_banks']['Row'];

const AdminQuestionBanks = () => {
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [form, setForm] = useState({ subject: '', studentClass: '', title: '' });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadQuestionBanks = async () => {
    const { data } = await supabase.from('question_banks').select('*').order('created_at', { ascending: false });
    setQuestionBanks(data || []);
  };

  useEffect(() => {
    loadQuestionBanks();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!form.subject || !form.studentClass || !form.title.trim()) {
      toast.error('Select subject, class, and enter a title');
      return;
    }

    setUploading(true);
    setProgress(0);

    const filePath = buildQuestionBankStoragePath(form.subject, file.name);
    const { error: uploadError } = await supabase.storage.from(QUESTION_BANKS_BUCKET).upload(filePath, file, {
      onUploadProgress: (event) => {
        const pct = Math.round((event.loaded / event.total) * 100);
        setProgress(Math.min(pct, 100));
      },
    });

    if (uploadError) {
      toast.error('Upload failed: ' + uploadError.message);
      setUploading(false);
      setProgress(0);
      return;
    }

    setProgress(100);

    const { error } = await supabase.from('question_banks').insert({
      subject: form.subject,
      class: parseInt(form.studentClass),
      title: form.title.trim(),
      file_path: filePath,
    });

    if (error) {
      await supabase.storage.from(QUESTION_BANKS_BUCKET).remove([filePath]);
      toast.error('Save failed: ' + error.message);
    } else {
      toast.success('Question bank uploaded!');
      setForm({ subject: '', studentClass: '', title: '' });
      setFile(null);
      await loadQuestionBanks();
    }

    setUploading(false);
    setProgress(0);
  };

  const handleDelete = async (id: string, filePath: string) => {
    setDeletingId(id);
    const normalizedPath = extractQuestionBankStoragePath(filePath);

    const { error: storageError } = await supabase.storage.from(QUESTION_BANKS_BUCKET).remove([normalizedPath]);

    if (storageError) {
      toast.error('PDF delete failed: ' + storageError.message);
      setDeletingId(null);
      return;
    }

    const { error: dbError } = await supabase.from('question_banks').delete().eq('id', id);

    if (dbError) {
      toast.error('Record delete failed: ' + dbError.message);
      setDeletingId(null);
      return;
    }

    toast.success('Deleted');
    await loadQuestionBanks();
    setDeletingId(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Upload Question Bank</h1>
      <form onSubmit={handleUpload} className="glass-card-solid rounded-2xl p-6 space-y-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Subject</Label>
            <Select onValueChange={value => setForm(prev => ({ ...prev, subject: value }))} value={form.subject}>
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
            <Select onValueChange={value => setForm(prev => ({ ...prev, studentClass: value }))} value={form.studentClass}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="11">Class 11</SelectItem>
                <SelectItem value="12">Class 12</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Title</Label>
            <Input placeholder="Question bank title" value={form.title} onChange={event => setForm(prev => ({ ...prev, title: event.target.value }))} required className="mt-1" />
          </div>
        </div>
        <div>
          <Label>PDF File</Label>
          <Input type="file" accept=".pdf" onChange={event => setFile(event.target.files?.[0] || null)} className="mt-1" />
        </div>
        {uploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        <Button type="submit" className="gradient-primary text-primary-foreground rounded-xl" disabled={uploading}>
          <Upload size={16} className="mr-2" /> {uploading ? 'Uploading...' : 'Upload Question Bank'}
        </Button>
      </form>

      <h2 className="text-lg font-semibold mb-3">Uploaded Question Banks</h2>
      <div className="space-y-2">
        {questionBanks.map(questionBank => (
          <div key={questionBank.id} className="glass-card-solid rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpenText size={18} className="text-primary" />
              <div>
                <p className="font-medium text-sm">{questionBank.title}</p>
                <p className="text-xs text-muted-foreground">{questionBank.subject} • Class {questionBank.class}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="text-destructive rounded-lg" disabled={deletingId === questionBank.id} onClick={() => handleDelete(questionBank.id, questionBank.file_path)}>
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminQuestionBanks;