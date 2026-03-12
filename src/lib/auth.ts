// Custom student auth — mirrors admin localStorage approach (no Supabase Auth needed)

export interface StudentSession {
  id: string;
  name: string;
  phone: string;
  class: number;
  parent_contact?: string;
}

const SESSION_KEY = 'nxtrank_student';

export const getStudentSession = (): StudentSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StudentSession) : null;
  } catch {
    return null;
  }
};

export const setStudentSession = (student: StudentSession) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(student));
};

export const clearStudentSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
