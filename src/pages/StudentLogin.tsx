import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import logo from '@/assets/logo.jpeg';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const email = `${phone}@nxtrank.student`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error('Invalid phone number or password');
    } else {
      toast.success('Welcome back!');
      navigate('/student');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={logo} alt="NXT Rank" className="w-14 h-14 rounded-full mx-auto mb-3" />
          <h1 className="text-xl font-bold">Student Login</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
        </div>
        <form onSubmit={handleLogin} className="glass-card-solid rounded-2xl p-6 space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Enter phone number" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1" />
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground rounded-xl" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            New student? <Link to="/student-register" className="text-primary font-medium">Register here</Link>
          </p>
        </form>
        <p className="text-center mt-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
