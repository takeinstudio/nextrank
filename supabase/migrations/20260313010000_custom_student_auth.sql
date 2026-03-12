-- Migration: Replace Supabase Auth with custom student auth (localStorage-based)
-- Students no longer need to be linked to auth.users

-- 1. Add password_hash column (SHA-256 hex string)
ALTER TABLE students ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2. Drop the foreign key to auth.users if it exists (id is now self-managed UUID)
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_id_fkey;

-- 3. Set default for id to gen_random_uuid() so new inserts auto-generate IDs
ALTER TABLE students ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 4. Drop old auth-based policies on students
DROP POLICY IF EXISTS "Students can view their own profile" ON students;
DROP POLICY IF EXISTS "Students can update their own profile" ON students;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON students;

-- 5. Allow anon to register (insert) — registration happens unauthenticated
CREATE POLICY "Allow anon to register student" ON students
  FOR INSERT TO anon WITH CHECK (true);

-- 6. Allow anon to read students — needed for login (phone lookup + password check)
CREATE POLICY "Allow anon to read students" ON students
  FOR SELECT TO anon USING (true);

-- 7. Resources, tests, question_banks — allow anon SELECT (public course content)
DROP POLICY IF EXISTS "Allow anon select resources" ON resources;
CREATE POLICY "Allow anon select resources" ON resources
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon select tests" ON tests;
CREATE POLICY "Allow anon select tests" ON tests
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon select questions" ON questions;
CREATE POLICY "Allow anon select questions" ON questions
  FOR SELECT TO anon USING (true);

-- 8. Test attempts — allow anon insert and select (student_id tracked via our custom session)
DROP POLICY IF EXISTS "Allow anon insert test_attempts" ON test_attempts;
CREATE POLICY "Allow anon insert test_attempts" ON test_attempts
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select test_attempts" ON test_attempts;
CREATE POLICY "Allow anon select test_attempts" ON test_attempts
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon insert answers" ON answers;
CREATE POLICY "Allow anon insert answers" ON answers
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select answers" ON answers;
CREATE POLICY "Allow anon select answers" ON answers
  FOR SELECT TO anon USING (true);
