import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, model = 'gpt-4o' } = await req.json();

    // Verify API key exists
    if (!process.env.OPENAI_API_KEY) {
      return new Response('OpenAI API key not found', { status: 500 });
    }

    // Create chat completion
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      stream: true,
    });
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response as any);
    
    // Return a StreamingTextResponse, which is compatible with the Vercel AI SDK
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to communicate with OpenAI' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
