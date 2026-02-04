// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    const openAiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const body = await req.json()
    const { type } = body

    let requestBody

    if (type === 'chat') {
      // GHL Scenario Generator — text-only chat completion
      const { messages, temperature = 0.8, max_tokens = 2000 } = body
      requestBody = {
        model: 'gpt-4o-mini',
        messages,
        temperature,
        max_tokens,
      }
    } else if (type === 'vision') {
      // Text Extractor — image-based vision completion
      const { image_url, prompt, max_tokens = 4096 } = body
      requestBody = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: image_url, detail: 'high' } },
            ],
          },
        ],
        max_tokens,
        temperature: 0.1,
      }
    } else {
      throw new Error('Invalid request type. Use "chat" or "vision".')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || `OpenAI API error: ${response.status}`)
    }

    const content = data.choices?.[0]?.message?.content || ''

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
