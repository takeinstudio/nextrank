import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Database } from '@/integrations/supabase/types';
import { SUBJECT_FILTERS, type SubjectFilter } from '@/lib/subjects';
import { extractNotesStoragePath, NOTES_BUCKET } from '@/lib/storage';
import { toast } from 'sonner';

type Resource = Database['public']['Tables']['resources']['Row'];

const StudentResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
      setResources(data || []);
    };
    load();
  }, []);

  const downloadFile = async (filePath: string, title: string) => {
    const normalizedPath = extractNotesStoragePath(filePath);
    const { data } = supabase.storage.from(NOTES_BUCKET).getPublicUrl(normalizedPath);
    try {
      const res = await fetch(data.publicUrl);
      if (!res.ok) {
        toast.error('File not found. Please ask admin to re-upload this resource.');
        return;
      }
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error('Download failed. Please try again.');
    }
  };


  // Helper to extract chapter number from resource title
  const getChapterNumber = (title: string): number => {
    const match = title.match(/chapter\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : 9999; // fallback for non-chapter resources
  };

  // Sort resources by chapter number if present
  const sortByChapter = (arr: Resource[]) => {
    return [...arr].sort((a, b) => {
      const aNum = getChapterNumber(a.title || '');
      const bNum = getChapterNumber(b.title || '');
      if (a.class !== b.class) return (a.class || 0) - (b.class || 0);
      if (a.subject !== b.subject) return (a.subject || '').localeCompare(b.subject || '');
      return aNum - bNum;
    });
  };

  const filterResources = (subject: SubjectFilter) => {
    let filtered = subject === 'All'
      ? resources
      : resources.filter(r => r.subject?.trim().toLowerCase() === subject.toLowerCase());
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(r => (r.title || '').toLowerCase().includes(s));
    }
    return sortByChapter(filtered);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Resources</h1>
      <input
        type="text"
        placeholder="Search notes by title..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-primary"
      />
      <Tabs defaultValue="All">
        <TabsList className="mb-4 h-auto flex flex-wrap justify-start bg-muted rounded-xl">
          {SUBJECT_FILTERS.map(subject => (
            <TabsTrigger key={subject} value={subject} className="rounded-lg text-sm">{subject}</TabsTrigger>
          ))}
        </TabsList>
        {SUBJECT_FILTERS.map(subject => (
          <TabsContent key={subject} value={subject}>
            <div className="space-y-3">
              {filterResources(subject).length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No resources available for {subject === 'All' ? 'the selected filters' : subject} yet</p>
              ) : filterResources(subject).map((resource, index) => (
                <motion.div key={resource.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  className="glass-card-solid rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <FileText className="text-primary-foreground" size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{resource.title}</h3>
                      <p className="text-xs text-muted-foreground">Class {resource.class} • {resource.subject}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => downloadFile(resource.file_path, resource.title)}>
                    <Download size={14} />
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default StudentResources;
