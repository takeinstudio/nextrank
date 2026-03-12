import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const handleChangePw = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('nxtrank_admin_pw') || 'NextRankPruthiwiraj@07';
    if (currentPw !== stored) {
      toast.error('Current password is incorrect');
      return;
    }
    localStorage.setItem('nxtrank_admin_pw', newPw);
    toast.success('Password updated!');
    setCurrentPw('');
    setNewPw('');
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
