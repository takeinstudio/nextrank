-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  class INTEGER NOT NULL CHECK (class IN (11, 12)),
  parent_contact TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own data" ON public.students FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Students can insert own data" ON public.students FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Students can update own data" ON public.students FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow public read for admin" ON public.students FOR SELECT TO anon USING (true);

-- Tests table
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  class INTEGER NOT NULL CHECK (class IN (11, 12)),
  duration INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read tests" ON public.tests FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tests" ON public.tests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tests" ON public.tests FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete tests" ON public.tests FOR DELETE USING (true);

-- Questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert questions" ON public.questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete questions" ON public.questions FOR DELETE USING (true);

-- Test attempts table
CREATE TABLE public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  wrong_answers INTEGER NOT NULL DEFAULT 0,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own attempts" ON public.test_attempts FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert own attempts" ON public.test_attempts FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admin can read all attempts" ON public.test_attempts FOR SELECT TO anon USING (true);

-- Answers table
CREATE TABLE public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own answers" ON public.answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.test_attempts WHERE test_attempts.id = answers.attempt_id AND test_attempts.student_id = auth.uid())
);
CREATE POLICY "Students can insert own answers" ON public.answers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.test_attempts WHERE test_attempts.id = answers.attempt_id AND test_attempts.student_id = auth.uid())
);

-- Resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  class INTEGER NOT NULL CHECK (class IN (11, 12)),
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Anyone can insert resources" ON public.resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete resources" ON public.resources FOR DELETE USING (true);

-- Admin settings table
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON public.admin_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can update settings" ON public.admin_settings FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert settings" ON public.admin_settings FOR INSERT WITH CHECK (true);

-- Storage bucket for notes
INSERT INTO storage.buckets (id, name, public) VALUES ('notes', 'notes', true);

CREATE POLICY "Anyone can read notes" ON storage.objects FOR SELECT USING (bucket_id = 'notes');
CREATE POLICY "Anyone can upload notes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'notes');
CREATE POLICY "Anyone can delete notes" ON storage.objects FOR DELETE USING (bucket_id = 'notes');
