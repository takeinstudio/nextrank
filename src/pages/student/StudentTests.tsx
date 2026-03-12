import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Database } from '@/integrations/supabase/types';
import { SUBJECT_FILTERS, type SubjectFilter } from '@/lib/subjects';

type Test = Database['public']['Tables']['tests']['Row'];

const StudentTests = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
      setTests(data || []);
    };
    load();
  }, []);

  const filterTests = (subject: SubjectFilter) =>
    subject === 'All' ? tests : tests.filter(test => test.subject === subject);

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Mock Tests</h1>
      <Tabs defaultValue="All">
        <TabsList className="mb-4 h-auto flex flex-wrap justify-start bg-muted rounded-xl">
          {SUBJECT_FILTERS.map(subject => (
            <TabsTrigger key={subject} value={subject} className="rounded-lg text-sm">{subject}</TabsTrigger>
          ))}
        </TabsList>
        {SUBJECT_FILTERS.map(subject => (
          <TabsContent key={subject} value={subject}>
            {filterTests(subject).length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No tests available for {subject === 'All' ? 'the selected filters' : subject} yet</p>
            ) : (
              <div className="space-y-3">
                {filterTests(subject).map((test, index) => (
                  <motion.div key={test.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    className="glass-card-solid rounded-xl p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                          <ClipboardList className="text-primary-foreground" size={18} />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{test.title}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            {test.subject} • Class {test.class} <Clock size={12} /> {test.duration} min
                          </p>
                        </div>
                      </div>
                      <Button size="sm" className="gradient-primary text-primary-foreground rounded-lg" onClick={() => navigate(`/student/exam/${test.id}`)}>
                        Start <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default StudentTests;
