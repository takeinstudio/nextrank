INSERT INTO public.subject_catalog (name, display_order)
VALUES
  ('Others', 8)
ON CONFLICT (name) DO NOTHING;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'tests_subject_supported_check'
      AND conrelid = 'public.tests'::regclass
  ) THEN
    ALTER TABLE public.tests DROP CONSTRAINT tests_subject_supported_check;
  END IF;
END $$;

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
      'English',
      'Others'
    )
  );

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'resources_subject_supported_check'
      AND conrelid = 'public.resources'::regclass
  ) THEN
    ALTER TABLE public.resources DROP CONSTRAINT resources_subject_supported_check;
  END IF;
END $$;

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
      'English',
      'Others'
    )
  );
