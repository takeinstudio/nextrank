import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getStudentSession } from '@/lib/auth';
import { sendMessageToAI, imageFileToBase64, type ChatMessage } from '@/lib/ai';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  ImagePlus,
  X,
  Trash2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  imagePreview?: string; // local base64 for display only
  created_at?: string;
}

// ─── Markdown renderer ────────────────────────────────────────────────────────

function formatInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith('**'))
      parts.push(<strong key={match.index} className="font-semibold">{token.slice(2, -2)}</strong>);
    else if (token.startsWith('*'))
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    else if (token.startsWith('`'))
      parts.push(
        <code key={match.index} className="bg-black/20 px-1 py-0.5 rounded text-[11px] font-mono">
          {token.slice(1, -1)}
        </code>,
      );
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('### '))
      return <p key={i} className="font-semibold text-sm mt-3 mb-1">{formatInline(line.slice(4))}</p>;
    if (line.startsWith('## '))
      return <p key={i} className="font-bold text-base mt-3 mb-1">{formatInline(line.slice(3))}</p>;
    if (line.startsWith('# '))
      return <p key={i} className="font-bold text-lg mt-3 mb-1">{formatInline(line.slice(2))}</p>;
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* '))
      return (
        <div key={i} className="flex gap-2 my-0.5 ml-1">
          <span className="text-violet-300 mt-0.5 flex-shrink-0">•</span>
          <span>{formatInline(line.slice(2))}</span>
        </div>
      );
    const numberedMatch = line.match(/^(\d+)\. (.*)/);
    if (numberedMatch)
      return (
        <div key={i} className="flex gap-2 my-0.5 ml-1">
          <span className="text-violet-300 font-semibold flex-shrink-0 min-w-[1.25rem]">{numberedMatch[1]}.</span>
          <span>{formatInline(numberedMatch[2])}</span>
        </div>
      );
    if (line === '') return <div key={i} className="h-1.5" />;
    return <p key={i} className="my-0.5 leading-relaxed">{formatInline(line)}</p>;
  });
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

const TypingDots = () => (
  <div className="flex gap-1 px-1 py-0.5">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 rounded-full bg-muted-foreground/60 inline-block"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const StudentAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const student = getStudentSession();

  // ── Load chat history from Supabase ─────────────────────────────────────────
  useEffect(() => {
    if (!student) return;
    const load = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('student_id', student.id)
        .order('created_at', { ascending: true })
        .limit(100);
      if (data && data.length > 0) {
        setMessages(
          data.map((row: { id: string; role: 'user' | 'assistant'; message: string; created_at: string }) => ({
            id: row.id,
            role: row.role,
            content: row.message,
            created_at: row.created_at,
          })),
        );
      } else {
        // Welcome message
        setMessages([
          {
            role: 'assistant',
            content:
              'Namaste! 🙏 I am **NXT Rank Assistant**, your personal CHSE Odisha tutor.\n\nI can help you with:\n• Physics, Chemistry, Mathematics, Biology\n• IT (Java), English, Odia\n\nAsk me any question or upload a photo of a question to get started!',
          },
        ]);
      }
      setHistoryLoaded(true);
    };
    load();
  }, [student?.id]);

  // ── Auto-scroll ──────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ── Auto-resize textarea ─────────────────────────────────────────────────────
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [input]);

  // ── Image selection ──────────────────────────────────────────────────────────
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setError('Only JPG, JPEG, and PNG images are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.');
      return;
    }
    setImageFile(file);
    const preview = await imageFileToBase64(file);
    setImagePreview(preview);
    e.target.value = '';
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // ── Save a single message to Supabase ────────────────────────────────────────
  const saveMessage = useCallback(
    async (role: 'user' | 'assistant', content: string) => {
      if (!student) return;
      await supabase.from('chat_messages').insert({
        student_id: student.id,
        role,
        message: content,
      });
    },
    [student?.id],
  );

  // ── Send message ─────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = input.trim();
    if (!text && !imageFile) return;
    if (isLoading) return;

    setError(null);

    // Build user message for display
    const userMsg: Message = {
      role: 'user',
      content: text || (imageFile ? 'Please solve this question.' : ''),
      imagePreview: imagePreview ?? undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const capturedImagePreview = imagePreview;
    clearImage();
    setIsLoading(true);

    try {
      // Build history for API (last 20 turns to stay within token limits)
      const historyChatMessages: ChatMessage[] = messages
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.content }));

      const newUserChatMsg: ChatMessage = {
        role: 'user',
        content: userMsg.content,
        imageDataUrl: capturedImagePreview ?? undefined,
      };

      const aiText = await sendMessageToAI([...historyChatMessages, newUserChatMsg]);

      const aiMsg: Message = { role: 'assistant', content: aiText };
      setMessages((prev) => [...prev, aiMsg]);

      // Persist both messages
      await saveMessage('user', userMsg.content);
      await saveMessage('assistant', aiText);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
      // Remove the optimistic user message on failure
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  // ── Clear history ─────────────────────────────────────────────────────────────
  const handleClearHistory = async () => {
    if (!student) return;
    await supabase.from('chat_messages').delete().eq('student_id', student.id);
    setMessages([
      {
        role: 'assistant',
        content:
          'Chat history cleared! 🗑️\n\nAsk me anything about your CHSE subjects — Physics, Chemistry, Maths, Biology, IT, English, or Odia.',
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!historyLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center animate-pulse">
            <Bot size={20} className="text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your assistant…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-0px)]">
      {/* ── Header ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-none">NXT Rank Assistant</p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Sparkles size={10} className="text-violet-400" />
              CHSE Odisha AI Tutor
            </p>
          </div>
        </div>
        <button
          onClick={handleClearHistory}
          title="Clear chat history"
          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id ?? idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mb-0.5">
                  <Bot size={14} className="text-white" />
                </div>
              )}

              {/* Bubble */}
              <div
                className={`max-w-[85%] md:max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm shadow-md'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                {/* Image preview inside bubble */}
                {msg.imagePreview && (
                  <img
                    src={msg.imagePreview}
                    alt="Uploaded question"
                    className="rounded-lg mb-2 max-h-48 w-auto object-contain"
                  />
                )}
                {/* Text */}
                {msg.role === 'assistant' ? (
                  <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mb-0.5">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
              <TypingDots />
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-xl px-4 py-3 text-sm"
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ── */}
      <div className="flex-shrink-0 border-t border-border bg-background/80 backdrop-blur-md px-3 md:px-6 py-3">
        {/* Image preview strip */}
        {imagePreview && (
          <div className="mb-2 flex items-center gap-2">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Selected"
                className="h-14 w-auto rounded-lg border border-border object-cover"
              />
              <button
                onClick={clearImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <X size={10} />
              </button>
            </div>
            <span className="text-xs text-muted-foreground">{imageFile?.name}</span>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Image upload button */}
          <button
            onClick={() => imageInputRef.current?.click()}
            title="Upload an image of a question"
            className="flex-shrink-0 w-10 h-10 rounded-xl border border-border bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-violet-500 hover:border-violet-500/50 transition-colors"
          >
            <ImagePlus size={18} />
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={handleImageSelect}
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about CHSE subjects…"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 placeholder:text-muted-foreground/60 transition-all"
            style={{ minHeight: '42px', maxHeight: '120px' }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !imageFile)}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
          >
            <Send size={16} />
          </button>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/50 mt-2">
          NXT Rank Assistant · Powered by Gemini · CHSE Odisha
        </p>
      </div>
    </div>
  );
};

export default StudentAI;
