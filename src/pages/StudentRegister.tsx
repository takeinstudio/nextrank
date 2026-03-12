import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import logo from '@/assets/logo.jpeg';

const StudentRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', studentClass: '', parentContact: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const email = `${form.phone}@nxtrank.com`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password: form.password,
      options: { emailRedirectTo: undefined, data: { phone: form.phone } },
    });
    if (error) {
      if (error.message.toLowerCase().includes('rate limit') || error.message.toLowerCase().includes('email')) {
        toast.error('Too many registrations. Please try again after a few minutes, or contact admin.');
      } else {
        toast.error(error.message);
      }
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('students').insert({
        id: data.user.id,
        name: form.name,
        phone: form.phone,
        class: parseInt(form.studentClass),
        parent_contact: form.parentContact,
      });
      if (profileError) {
        toast.error('Registration failed: ' + profileError.message);
      } else {
        toast.success('Registration successful!');
        navigate('/student');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <img src={logo} alt="NXT Rank" className="w-14 h-14 rounded-full mx-auto mb-3" />
          <h1 className="text-xl font-bold">Student Registration</h1>
          <p className="text-sm text-muted-foreground">Create your NXT Rank account</p>
        </div>
        <form onSubmit={handleRegister} className="glass-card-solid rounded-2xl p-6 space-y-3">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Enter phone number" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label>Class</Label>
            <Select onValueChange={v => setForm(p => ({ ...p, studentClass: v }))} required>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select class" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="11">Class 11</SelectItem>
                <SelectItem value="12">Class 12</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="parent">Parent Contact</Label>
            <Input id="parent" type="tel" placeholder="Parent phone number" value={form.parentContact} onChange={e => setForm(p => ({ ...p, parentContact: e.target.value }))} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Create password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} className="mt-1" />
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground rounded-xl" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already registered? <Link to="/student-login" className="text-primary font-medium">Login here</Link>
          </p>
        </form>
        <p className="text-center mt-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;
