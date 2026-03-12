import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      setStudents(data || []);
    };
    load();
  }, []);

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) || s.phone?.includes(search)
  );

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input placeholder="Search by name or phone..." className="pl-9 rounded-xl" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="glass-card-solid rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Class</th>
                <th className="p-3">Parent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-accent/50">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3">{s.phone}</td>
                  <td className="p-3">{s.class}</td>
                  <td className="p-3">{s.parent_contact}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
