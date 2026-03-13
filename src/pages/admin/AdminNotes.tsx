import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, Trash2, FileText } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
import { SUBJECT_FILTERS, SUBJECTS, type SubjectFilter } from '@/lib/subjects';
import { buildNotesStoragePath, extractNotesStoragePath, NOTES_BUCKET } from '@/lib/storage';

type Resource = Database['public']['Tables']['resources']['Row'];

const getSubjectGroups = (resources: Resource[]) => {
  const grouped = resources.reduce<Record<string, Resource[]>>((acc, resource) => {
    const key = resource.subject || 'Uncategorized';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(resource);
    return acc;
  }, {});

  const knownSubjects = SUBJECTS.filter(subject => grouped[subject]?.length);
  const extraSubjects = Object.keys(grouped)
    .filter(subject => !SUBJECTS.includes(subject as (typeof SUBJECTS)[number]))
    .sort((left, right) => left.localeCompare(right));

  return [...knownSubjects, ...extraSubjects].map(subject => ({
    subject,
    resources: grouped[subject],
  }));
};

const AdminNotes = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState({ subject: '', studentClass: '', title: '' });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectFilter>('All');

  const visibleResources = selectedSubject === 'All'
    ? resources
    : resources.filter(resource => resource.subject === selectedSubject);

  const subjectGroups = getSubjectGroups(visibleResources);

  const loadResources = async () => {
    const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
    setResources(data || []);
  };

  useEffect(() => { loadResources(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a PDF file'); return; }
    if (!form.subject || !form.studentClass || !form.title.trim()) {
      toast.error('Select subject, class, and enter a title');
      return;
    }
    setUploading(true);
    setProgress(0);

    const filePath = buildNotesStoragePath(form.subject, file.name);
    const { error: uploadError } = await supabase.storage.from(NOTES_BUCKET).upload(filePath, file, {
      onUploadProgress: (evt) => {
        const pct = Math.round((evt.loaded / evt.total) * 100);
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

    const { error } = await supabase.from('resources').insert({
      subject: form.subject,
      class: parseInt(form.studentClass),
      title: form.title.trim(),
      file_path: filePath,
    });

    if (error) {
      await supabase.storage.from(NOTES_BUCKET).remove([filePath]);
      toast.error('Save failed: ' + error.message);
    }
    else {
      toast.success('Notes uploaded!');
      setForm({ subject: '', studentClass: '', title: '' });
      setFile(null);
      loadResources();
    }
    setUploading(false);
    setProgress(0);
  };

  const handleDelete = async (id: string, filePath: string) => {
    const normalizedPath = extractNotesStoragePath(filePath);
    setDeletingId(id);

    // Storage delete — ignore "not found" (file may already be gone)
    const { error: storageError } = await supabase.storage.from(NOTES_BUCKET).remove([normalizedPath]);
    if (storageError && !storageError.message.toLowerCase().includes('not found')) {
      toast.error('PDF delete failed: ' + storageError.message);
      setDeletingId(null);
      return;
    }

    const { error: dbError, count } = await supabase
      .from('resources')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (dbError) {
      toast.error('Record delete failed: ' + dbError.message);
      setDeletingId(null);
      return;
    }

    if (count === 0) {
      toast.error('Delete failed: no record removed. Please run the latest SQL migration in Supabase.');
      setDeletingId(null);
      return;
    }

    toast.success('Deleted');
    await loadResources();
    setDeletingId(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Upload Notes</h1>
      <form onSubmit={handleUpload} className="glass-card-solid rounded-2xl p-6 space-y-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <Label>Title</Label>
            <Input placeholder="Notes title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required className="mt-1" />
          </div>
        </div>
        <div>
          <Label>PDF File</Label>
          <Input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="mt-1" />
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
          <Upload size={16} className="mr-2" /> {uploading ? 'Uploading...' : 'Upload Notes'}
        </Button>
      </form>

      <h2 className="text-lg font-semibold mb-3">Uploaded Notes</h2>
      <div className="mb-4 max-w-xs">
        <Label>Filter by subject</Label>
        <Select value={selectedSubject} onValueChange={(value) => setSelectedSubject(value as SubjectFilter)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECT_FILTERS.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {subjectGroups.length === 0 ? (
          <div className="glass-card-solid rounded-xl p-6 text-sm text-muted-foreground">
            No uploaded notes found for {selectedSubject === 'All' ? 'the selected filter' : selectedSubject}.
          </div>
        ) : subjectGroups.map(group => (
          <div key={group.subject} className="glass-card-solid rounded-2xl p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <h3 className="text-base font-semibold">{group.subject}</h3>
                <p className="text-xs text-muted-foreground">{group.resources.length} uploaded note{group.resources.length === 1 ? '' : 's'}</p>
              </div>
            </div>

            <div className="space-y-2">
              {group.resources.map(resource => (
                <div key={resource.id} className="rounded-xl border border-border/60 bg-white/70 p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={18} className="shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">Class {resource.class}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-destructive rounded-lg shrink-0" disabled={deletingId === resource.id} onClick={() => handleDelete(resource.id, resource.file_path)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotes;
