declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  env: { get: (key: string) => string | undefined };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

type Role = 'user' | 'assistant';

interface IncomingMessage {
  role: Role;
  content: string;
  imageDataUrl?: string;
}

interface IncomingBody {
  messages: IncomingMessage[];
}

const parseImageDataUrl = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png));base64,(.+)$/i);
  if (!match) return null;

  const mime = match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1].toLowerCase();
  const data = match[2];
  return { mime, data };
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as IncomingBody;
    const messages = body?.messages ?? [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages[] is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const contents = messages.map((msg) => {
      const parts: Array<Record<string, unknown>> = [];
      const trimmedText = (msg.content || '').trim();

      if (trimmedText) {
        parts.push({ text: trimmedText });
      }

      if (msg.imageDataUrl) {
        const parsed = parseImageDataUrl(msg.imageDataUrl);
        if (!parsed) {
          throw new Error('Invalid image format. Only JPG/JPEG/PNG are supported.');
        }

        parts.push({
          inline_data: {
            mime_type: parsed.mime,
            data: parsed.data,
          },
        });
      }

      if (parts.length === 0) {
        parts.push({ text: 'Please help with this question.' });
      }

      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts,
      };
    });

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: {
            temperature: 0.35,
            topP: 0.9,
            maxOutputTokens: 1800,
          },
        }),
      },
    );

    if (!geminiRes.ok) {
      const details = await geminiRes.text();
      return new Response(
        JSON.stringify({ error: 'Gemini API error', details, reply: 'NXT Rank Assistant is temporarily unavailable. Please try again.' }),
        { status: geminiRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const geminiData = await geminiRes.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const reply = geminiData.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? '')
      .join('')
      .trim();

    if (!reply) {
      return new Response(
        JSON.stringify({
          reply:
            'NXT Rank Assistant is temporarily unable to answer right now. Please try again in a moment.',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return new Response(
      JSON.stringify({
        error: message,
        reply:
          'NXT Rank Assistant is currently unavailable. Please retry in a few seconds.',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
