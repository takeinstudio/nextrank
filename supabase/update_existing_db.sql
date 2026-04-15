ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_class_check;
ALTER TABLE public.students ADD CONSTRAINT students_class_check CHECK (class BETWEEN 1 AND 12);
ALTER TABLE public.tests DROP CONSTRAINT IF EXISTS tests_class_check;
ALTER TABLE public.tests ADD CONSTRAINT tests_class_check CHECK (class BETWEEN 1 AND 12);
ALTER TABLE public.resources DROP CONSTRAINT IF EXISTS resources_class_check;
ALTER TABLE public.resources ADD CONSTRAINT resources_class_check CHECK (class BETWEEN 1 AND 12);
ALTER TABLE public.question_banks DROP CONSTRAINT IF EXISTS question_banks_class_check;
ALTER TABLE public.question_banks ADD CONSTRAINT question_banks_class_check CHECK (class BETWEEN 1 AND 12);
