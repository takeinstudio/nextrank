import { Atom, BookOpen, Calculator, FlaskConical, Laptop, Leaf, Languages, type LucideIcon } from 'lucide-react';

export const SUBJECTS = [
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology',
  'Information Technology (Java)',
  'Odia',
  'English',
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const SUBJECT_FILTERS = ['All', ...SUBJECTS] as const;

export type SubjectFilter = (typeof SUBJECT_FILTERS)[number];

export interface SubjectCard {
  name: Subject;
  desc: string;
  gradient: string;
  icon: LucideIcon;
}

export const SUBJECT_CARDS: SubjectCard[] = [
  { icon: Atom, name: 'Physics', desc: 'Mechanics, optics, electromagnetism and modern physics', gradient: 'from-sky-400 to-blue-500' },
  { icon: FlaskConical, name: 'Chemistry', desc: 'Organic, inorganic and physical chemistry fundamentals', gradient: 'from-emerald-400 to-teal-500' },
  { icon: Calculator, name: 'Mathematics', desc: 'Calculus, algebra, trigonometry and problem solving', gradient: 'from-violet-400 to-indigo-500' },
  { icon: Leaf, name: 'Biology', desc: 'Botany, zoology, genetics and life science concepts', gradient: 'from-lime-400 to-green-500' },
  { icon: Laptop, name: 'Information Technology (Java)', desc: 'Java programming, logic building and IT fundamentals', gradient: 'from-amber-400 to-orange-500' },
  { icon: Languages, name: 'Odia', desc: 'Grammar, comprehension and CHSE-oriented language practice', gradient: 'from-rose-400 to-pink-500' },
  { icon: BookOpen, name: 'English', desc: 'Grammar, writing skills, reading comprehension and literature', gradient: 'from-cyan-400 to-sky-500' },
];