CREATE TABLE IF NOT EXISTS public.question_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  class INTEGER NOT NULL CHECK (class IN (11, 12)),
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.question_banks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'question_banks'
      AND policyname = 'Anyone can read question banks'
  ) THEN
    CREATE POLICY "Anyone can read question banks"
    ON public.question_banks
    FOR SELECT
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'question_banks'
      AND policyname = 'Anyone can insert question banks'
  ) THEN
    CREATE POLICY "Anyone can insert question banks"
    ON public.question_banks
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'question_banks'
      AND policyname = 'Anyone can delete question banks'
  ) THEN
    CREATE POLICY "Anyone can delete question banks"
    ON public.question_banks
    FOR DELETE
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'question_banks_subject_supported_check'
      AND conrelid = 'public.question_banks'::regclass
  ) THEN
    ALTER TABLE public.question_banks
      ADD CONSTRAINT question_banks_subject_supported_check
      CHECK (
        subject IN (
          'Physics',
          'Chemistry',
          'Mathematics',
          'Biology',
          'Information Technology (Java)',
          'Odia',
          'English'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM storage.buckets
    WHERE id = 'question-banks'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('question-banks', 'question-banks', true);
  END IF;
END $$;

DROP POLICY IF EXISTS "Anyone can read question banks files" ON storage.objects;
CREATE POLICY "Anyone can read question banks files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'question-banks');

DROP POLICY IF EXISTS "Anyone can upload question banks files" ON storage.objects;
CREATE POLICY "Anyone can upload question banks files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'question-banks');

DROP POLICY IF EXISTS "Anyone can delete question banks files" ON storage.objects;
CREATE POLICY "Anyone can delete question banks files"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'question-banks');