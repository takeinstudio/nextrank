CREATE TABLE IF NOT EXISTS public.subject_catalog (
  name TEXT PRIMARY KEY,
  display_order INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

INSERT INTO public.subject_catalog (name, display_order)
VALUES
  ('Physics', 1),
  ('Chemistry', 2),
  ('Mathematics', 3),
  ('Biology', 4),
  ('Information Technology (Java)', 5),
  ('Odia', 6),
  ('English', 7)
ON CONFLICT (name) DO UPDATE
SET display_order = EXCLUDED.display_order;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'tests_subject_supported_check'
      AND conrelid = 'public.tests'::regclass
  ) THEN
    ALTER TABLE public.tests
      ADD CONSTRAINT tests_subject_supported_check
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
    FROM pg_constraint
    WHERE conname = 'resources_subject_supported_check'
      AND conrelid = 'public.resources'::regclass
  ) THEN
    ALTER TABLE public.resources
      ADD CONSTRAINT resources_subject_supported_check
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
    WHERE id = 'notes'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('notes', 'notes', true);
  END IF;
END $$;

DROP POLICY IF EXISTS "Anyone can delete notes" ON storage.objects;
CREATE POLICY "Anyone can delete notes"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'notes');