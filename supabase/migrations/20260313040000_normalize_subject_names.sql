-- Normalize subject values in resources, tests, and question_banks to canonical names.
-- This fixes resources that were uploaded before the subject Select dropdown was added,
-- where subjects may have been stored with wrong casing or spacing.

-- resources
UPDATE public.resources SET subject = 'Physics'
  WHERE LOWER(TRIM(subject)) = 'physics' AND subject <> 'Physics';

UPDATE public.resources SET subject = 'Chemistry'
  WHERE LOWER(TRIM(subject)) = 'chemistry' AND subject <> 'Chemistry';

UPDATE public.resources SET subject = 'Mathematics'
  WHERE LOWER(TRIM(subject)) IN ('mathematics', 'maths', 'math') AND subject <> 'Mathematics';

UPDATE public.resources SET subject = 'Biology'
  WHERE LOWER(TRIM(subject)) = 'biology' AND subject <> 'Biology';

UPDATE public.resources SET subject = 'Information Technology (Java)'
  WHERE LOWER(TRIM(subject)) IN (
    'information technology (java)', 'information technology java',
    'it java', 'it (java)', 'java', 'it'
  ) AND subject <> 'Information Technology (Java)';

UPDATE public.resources SET subject = 'Odia'
  WHERE LOWER(TRIM(subject)) = 'odia' AND subject <> 'Odia';

UPDATE public.resources SET subject = 'English'
  WHERE LOWER(TRIM(subject)) = 'english' AND subject <> 'English';

-- tests (same normalization)
UPDATE public.tests SET subject = 'Physics'
  WHERE LOWER(TRIM(subject)) = 'physics' AND subject <> 'Physics';

UPDATE public.tests SET subject = 'Chemistry'
  WHERE LOWER(TRIM(subject)) = 'chemistry' AND subject <> 'Chemistry';

UPDATE public.tests SET subject = 'Mathematics'
  WHERE LOWER(TRIM(subject)) IN ('mathematics', 'maths', 'math') AND subject <> 'Mathematics';

UPDATE public.tests SET subject = 'Biology'
  WHERE LOWER(TRIM(subject)) = 'biology' AND subject <> 'Biology';

UPDATE public.tests SET subject = 'Information Technology (Java)'
  WHERE LOWER(TRIM(subject)) IN (
    'information technology (java)', 'information technology java',
    'it java', 'it (java)', 'java', 'it'
  ) AND subject <> 'Information Technology (Java)';

UPDATE public.tests SET subject = 'Odia'
  WHERE LOWER(TRIM(subject)) = 'odia' AND subject <> 'Odia';

UPDATE public.tests SET subject = 'English'
  WHERE LOWER(TRIM(subject)) = 'english' AND subject <> 'English';

-- question_banks (same normalization)
UPDATE public.question_banks SET subject = 'Physics'
  WHERE LOWER(TRIM(subject)) = 'physics' AND subject <> 'Physics';

UPDATE public.question_banks SET subject = 'Chemistry'
  WHERE LOWER(TRIM(subject)) = 'chemistry' AND subject <> 'Chemistry';

UPDATE public.question_banks SET subject = 'Mathematics'
  WHERE LOWER(TRIM(subject)) IN ('mathematics', 'maths', 'math') AND subject <> 'Mathematics';

UPDATE public.question_banks SET subject = 'Biology'
  WHERE LOWER(TRIM(subject)) = 'biology' AND subject <> 'Biology';

UPDATE public.question_banks SET subject = 'Information Technology (Java)'
  WHERE LOWER(TRIM(subject)) IN (
    'information technology (java)', 'information technology java',
    'it java', 'it (java)', 'java', 'it'
  ) AND subject <> 'Information Technology (Java)';

UPDATE public.question_banks SET subject = 'Odia'
  WHERE LOWER(TRIM(subject)) = 'odia' AND subject <> 'Odia';

UPDATE public.question_banks SET subject = 'English'
  WHERE LOWER(TRIM(subject)) = 'english' AND subject <> 'English';
