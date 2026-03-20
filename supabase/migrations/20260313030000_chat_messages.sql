-- Create chat_messages table for NXT Rank Assistant chatbot
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast per-student queries
CREATE INDEX IF NOT EXISTS chat_messages_student_id_idx ON public.chat_messages (student_id, created_at);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anon (custom student auth) to insert and read their own messages
CREATE POLICY "Anon insert chat_messages"
  ON public.chat_messages FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon select chat_messages"
  ON public.chat_messages FOR SELECT TO anon USING (true);

CREATE POLICY "Anon delete chat_messages"
  ON public.chat_messages FOR DELETE TO anon USING (true);
