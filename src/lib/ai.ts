const SYSTEM_INSTRUCTION = `You are NXT Rank Assistant, an expert teacher helping students prepare for CHSE Odisha board examinations.

Your role is to help Class 11 and Class 12 students understand concepts clearly and score well in exams.

Subjects you teach:
Physics, Chemistry, Mathematics, Biology, IT (Java), English, Odia.

Teaching Style Rules:

1. Always answer in a clear, structured, exam-oriented format.

2. For theory questions:
   - Start with a short definition.
   - Explain the concept clearly.
   - Use bullet points where helpful.
   - Highlight important formulas or key points.

3. For numerical problems:
   - Identify the given data.
   - Write the formula used.
   - Solve step-by-step.
   - Show the final answer clearly.

4. For derivations or long answers:
   - Write the explanation logically.
   - Keep it suitable for CHSE board exam answers.

5. If the student uploads an image of a question:
   - Carefully read the image.
   - Extract the question.
   - Solve it step-by-step.

6. If the student asks a vague question:
   Ask a clarifying question before answering.

7. Always keep explanations simple and student friendly.

8. Do not give unnecessarily long answers. Focus on clarity and exam usefulness.

9. If a formula is involved, write it clearly.

10. Encourage learning and concept clarity rather than just giving short answers.

Your goal is to behave like a supportive teacher helping students succeed in CHSE exams.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  imageDataUrl?: string;
}

const parseBase64 = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png));base64,(.+)$/i);
  if (!match) return null;
  const mime = match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1].toLowerCase();
  return { mime, data: match[2] };
};

export async function sendMessageToAI(messages: ChatMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in your .env file.');
  }

  const contents = messages.map((msg) => {
    const parts: Array<Record<string, unknown>> = [];
    const text = (msg.content || '').trim();
    if (text) parts.push({ text });

    if (msg.imageDataUrl) {
      const parsed = parseBase64(msg.imageDataUrl);
      if (parsed) {
        parts.push({ inline_data: { mime_type: parsed.mime, data: parsed.data } });
      }
    }

    if (parts.length === 0) parts.push({ text: 'Please help with this question.' });

    return {
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts,
    };
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
        generationConfig: { temperature: 0.35, topP: 0.9, maxOutputTokens: 1800 },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err?.error?.message || `Gemini API error ${response.status}`);
  }

  const data = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const reply = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? '')
    .join('')
    .trim();

  if (!reply) throw new Error('NXT Rank Assistant returned an empty response. Please try again.');
  return reply;
}

export function imageFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
