import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Database } from '@/integrations/supabase/types';
import { SUBJECT_FILTERS, type SubjectFilter } from '@/lib/subjects';
import { extractNotesStoragePath, NOTES_BUCKET } from '@/lib/storage';

type Resource = Database['public']['Tables']['resources']['Row'];

const StudentResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
      setResources(data || []);
    };
    load();
  }, []);

  const downloadFile = async (filePath: string) => {
    const normalizedPath = extractNotesStoragePath(filePath);
    const { data, error } = await supabase.storage.from(NOTES_BUCKET).createSignedUrl(normalizedPath, 3600);

    if (error) {
      return;
    }

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    }
  };

  const filterResources = (subject: SubjectFilter) =>
    subject === 'All' ? resources : resources.filter(r => r.subject === subject);

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Resources</h1>
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
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => downloadFile(resource.file_path)}>
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
