import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StudentResources = () => {
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
      setResources(data || []);
    };
    load();
  }, []);

  const downloadFile = async (filePath: string, title: string) => {
    const { data } = await supabase.storage.from('notes').createSignedUrl(filePath, 3600);
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    }
  };

  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics'];

  const filterResources = (subject: string) =>
    subject === 'All' ? resources : resources.filter(r => r.subject === subject);

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Resources</h1>
      <Tabs defaultValue="All">
        <TabsList className="mb-4 bg-muted rounded-xl">
          {subjects.map(s => (
            <TabsTrigger key={s} value={s} className="rounded-lg text-sm">{s}</TabsTrigger>
          ))}
        </TabsList>
        {subjects.map(s => (
          <TabsContent key={s} value={s}>
            <div className="space-y-3">
              {filterResources(s).length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No resources available yet</p>
              ) : filterResources(s).map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card-solid rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <FileText className="text-primary-foreground" size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{r.title}</h3>
                      <p className="text-xs text-muted-foreground">Class {r.class} • {r.subject}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => downloadFile(r.file_path, r.title)}>
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
