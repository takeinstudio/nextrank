import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

const AdminSettings = () => {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const [loading, setLoading] = useState(false);

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error: fetchErr } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'admin_password')
        .maybeSingle();
      
      const stored = data?.value;
      
      if (!stored) {
        toast.error('Admin password is not set in the database.');
        setLoading(false);
        return;
      }
      
      if (currentPw !== stored) {
        toast.error('Current password is incorrect');
        setLoading(false);
        return;
      }
      
      const { error: upsertErr } = await supabase
        .from('admin_settings')
        .upsert({ key: 'admin_password', value: newPw }, { onConflict: 'key' });
        
      if (upsertErr) throw upsertErr;
      
      toast.success('Password updated in database!');
      setCurrentPw('');
      setNewPw('');
    } catch (err: any) {
      toast.error('Failed to update password: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleChangePw} className="glass-card-solid rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold">Change Admin Password</h2>
        <div>
          <Label>Current Password</Label>
          <Input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label>New Password</Label>
          <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={6} className="mt-1" />
        </div>
        <Button type="submit" className="gradient-primary text-primary-foreground rounded-xl">Update Password</Button>
      </form>
    </div>
  );
};

export default AdminSettings;
