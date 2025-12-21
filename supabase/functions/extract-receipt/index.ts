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
      headers: corsHeaders 
    })
  }

  try {
    const { base64Data, mediaType } = await req.json()

    const extractionPrompt = `Extract from this receipt/invoice and respond ONLY with JSON (no markdown):
{"name": "vendor name", "amount": number, "date": "YYYY-MM-DD or empty", "dueDate": "YYYY-MM-DD or empty"}`

    const openAiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Send everything as image_url - this works for both images AND PDFs in gpt-4o-mini
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: extractionPrompt },
              { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64Data}` } }
            ]
          }
        ],
        max_tokens: 1000
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error')
    }

    const text = data.choices?.[0]?.message?.content || ''
    const extracted = JSON.parse(text.replace(/```json|```/g, '').trim())

    return new Response(JSON.stringify(extracted), {
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