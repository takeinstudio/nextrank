import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import logo from '@/assets/logo.jpeg';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'admin_password')
        .maybeSingle();
        
      const ADMIN_PASSWORD = data?.value;
      
      if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
        localStorage.setItem('nxtrank_admin', 'true');
        toast.success('Welcome, Admin!');
        navigate('/admin');
      } else {
        toast.error('Invalid admin password');
      }
    } catch (err) {
      toast.error('Failed to verify password connected to Supabase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={logo} alt="NXT Rank" className="w-14 h-14 rounded-full mx-auto mb-3" />
          <h1 className="text-xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Enter admin password to continue</p>
        </div>
        <form onSubmit={handleLogin} className="glass-card-solid rounded-2xl p-6 space-y-4">
          <div>
            <Label htmlFor="password">Admin Password</Label>
            <Input id="password" type="password" placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1" />
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground rounded-xl" disabled={loading}>
            {loading ? 'Verifying...' : 'Login as Admin'}
          </Button>
        </form>
        <p className="text-center mt-4">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
