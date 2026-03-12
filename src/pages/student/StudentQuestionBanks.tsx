import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { BookOpenText, Download } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
import { SUBJECT_FILTERS, type SubjectFilter } from '@/lib/subjects';
import { extractQuestionBankStoragePath, QUESTION_BANKS_BUCKET } from '@/lib/storage';
import { toast } from 'sonner';

type QuestionBank = Database['public']['Tables']['question_banks']['Row'];

const StudentQuestionBanks = () => {
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('question_banks').select('*').order('created_at', { ascending: false });
      setQuestionBanks(data || []);
    };

    load();
  }, []);

  const downloadFile = async (filePath: string, title: string) => {
    const normalizedPath = extractQuestionBankStoragePath(filePath);
    const { data } = supabase.storage.from(QUESTION_BANKS_BUCKET).getPublicUrl(normalizedPath);
    try {
      const res = await fetch(data.publicUrl);
      if (!res.ok) {
        toast.error('File not found. Please ask admin to re-upload this question bank.');
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

  const filterQuestionBanks = (subject: SubjectFilter) =>
    subject === 'All' ? questionBanks : questionBanks.filter(questionBank => questionBank.subject === subject);

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Question Banks</h1>
      <Tabs defaultValue="All">
        <TabsList className="mb-4 h-auto flex flex-wrap justify-start bg-muted rounded-xl">
          {SUBJECT_FILTERS.map(subject => (
            <TabsTrigger key={subject} value={subject} className="rounded-lg text-sm">{subject}</TabsTrigger>
          ))}
        </TabsList>
        {SUBJECT_FILTERS.map(subject => (
          <TabsContent key={subject} value={subject}>
            <div className="space-y-3">
              {filterQuestionBanks(subject).length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No question banks available for {subject === 'All' ? 'the selected filters' : subject} yet</p>
              ) : filterQuestionBanks(subject).map((questionBank, index) => (
                <motion.div
                  key={questionBank.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card-solid rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <BookOpenText className="text-primary-foreground" size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{questionBank.title}</h3>
                      <p className="text-xs text-muted-foreground">Class {questionBank.class} • {questionBank.subject}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => downloadFile(questionBank.file_path, questionBank.title)}>
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

export default StudentQuestionBanks;