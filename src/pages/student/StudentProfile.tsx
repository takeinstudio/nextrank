import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getStudentSession, clearStudentSession } from '@/lib/auth';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const [student, setStudent] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const session = getStudentSession();
      if (!session) return;
      // Fetch full record from DB to get parent_contact and latest data
      const { data } = await supabase.from('students').select('*').eq('id', session.id).maybeSingle();
      setStudent(data || session);
    };
    load();
  }, []);

  const handleLogout = () => {
    clearStudentSession();
    navigate('/');
  };

  if (!student) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="glass-card-solid rounded-2xl p-6">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto mb-4">
          {student.name?.[0]}
        </div>
        <div className="space-y-3 text-sm">
          <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{student.name}</span></div>
          <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{student.phone}</span></div>
          <div><span className="text-muted-foreground">Class:</span> <span className="font-medium">{student.class}</span></div>
          <div><span className="text-muted-foreground">Parent Contact:</span> <span className="font-medium">{student.parent_contact}</span></div>
        </div>
        <Button variant="outline" className="w-full mt-6 rounded-xl text-destructive border-destructive/30" onClick={handleLogout}>
          <LogOut size={16} className="mr-2" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default StudentProfile;
