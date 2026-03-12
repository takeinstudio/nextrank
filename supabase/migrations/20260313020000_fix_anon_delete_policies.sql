-- Fix: Explicitly grant anon role DELETE access on resources, tests, question_banks
-- Also ensures notes bucket is public, fixes test_attempts FK, and adds anon SELECT policies.

-- 1. Ensure notes bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('notes', 'notes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Ensure anon can READ from notes storage
DROP POLICY IF EXISTS "Anyone can read notes" ON storage.objects;
CREATE POLICY "Anyone can read notes"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'notes');

-- 3. Ensure anon can UPLOAD to notes storage
DROP POLICY IF EXISTS "Anyone can upload notes" ON storage.objects;
CREATE POLICY "Anyone can upload notes"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'notes');

-- 4. resources
DROP POLICY IF EXISTS "Anyone can delete resources" ON public.resources;
DROP POLICY IF EXISTS "Anon can delete resources" ON public.resources;
CREATE POLICY "Anon can delete resources"
  ON public.resources FOR DELETE TO anon USING (true);

-- 5. tests
DROP POLICY IF EXISTS "Anyone can delete tests" ON public.tests;
DROP POLICY IF EXISTS "Anon can delete tests" ON public.tests;
CREATE POLICY "Anon can delete tests"
  ON public.tests FOR DELETE TO anon USING (true);

-- 6. question_banks
DROP POLICY IF EXISTS "Anyone can delete question banks" ON public.question_banks;
DROP POLICY IF EXISTS "Anon can delete question banks" ON public.question_banks;
CREATE POLICY "Anon can delete question banks"
  ON public.question_banks FOR DELETE TO anon USING (true);

-- 7. notes storage delete
DROP POLICY IF EXISTS "Anyone can delete notes" ON storage.objects;
CREATE POLICY "Anyone can delete notes"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'notes');

-- 8. question-banks storage delete
DROP POLICY IF EXISTS "Anyone can delete question banks files" ON storage.objects;
CREATE POLICY "Anyone can delete question banks files"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'question-banks');

-- 9. Ensure question-images bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-images', 'question-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 10. Ensure anon can READ from question-images storage
DROP POLICY IF EXISTS "Anyone can read question images" ON storage.objects;
CREATE POLICY "Anyone can read question images"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'question-images');

-- 11. Ensure anon can UPLOAD to question-images storage
DROP POLICY IF EXISTS "Anyone can upload question images" ON storage.objects;
CREATE POLICY "Anyone can upload question images"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'question-images');

-- 12. Ensure anon can DELETE from question-images storage
DROP POLICY IF EXISTS "Anyone can delete question images" ON storage.objects;
CREATE POLICY "Anyone can delete question images"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'question-images');

-- 20. Fix test_attempts.student_id FK: drop reference to auth.users, allow any UUID (custom auth)
ALTER TABLE public.test_attempts DROP CONSTRAINT IF EXISTS test_attempts_student_id_fkey;

-- Also drop FK on students table if it still references auth.users
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_id_fkey;

-- 21. Fix test_attempts RLS: allow anon to insert/select using student_id directly (no auth.uid())
DROP POLICY IF EXISTS "Students can insert own attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Students can view own attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Allow anon insert test_attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Allow anon select test_attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Anon insert test_attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Anon select test_attempts" ON public.test_attempts;

CREATE POLICY "Anon insert test_attempts"
  ON public.test_attempts FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon select test_attempts"
  ON public.test_attempts FOR SELECT TO anon USING (true);

-- 22. Fix answers RLS similarly
DROP POLICY IF EXISTS "Students can insert own answers" ON public.answers;
DROP POLICY IF EXISTS "Students can view own answers" ON public.answers;
DROP POLICY IF EXISTS "Allow anon insert answers" ON public.answers;
DROP POLICY IF EXISTS "Allow anon select answers" ON public.answers;
DROP POLICY IF EXISTS "Anon insert answers" ON public.answers;
DROP POLICY IF EXISTS "Anon select answers" ON public.answers;

CREATE POLICY "Anon insert answers"
  ON public.answers FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon select answers"
  ON public.answers FOR SELECT TO anon USING (true);

