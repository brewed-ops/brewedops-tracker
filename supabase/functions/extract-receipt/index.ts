// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  try {
    const { base64Data, mediaType, isImage } = await req.json()

    // Check file size (base64 is ~33% larger than original)
    const estimatedSizeKB = (base64Data.length * 0.75) / 1024
    if (estimatedSizeKB > 5000) {
      throw new Error('File too large. Please upload a smaller file (max 5MB).')
    }

    const extractionPrompt = `Extract from this receipt/invoice and respond ONLY with JSON (no markdown):
{"name": "vendor name", "amount": number, "date": "YYYY-MM-DD or empty", "dueDate": "YYYY-MM-DD or empty"}`

    const openAiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAiKey) {
      throw new Error('OpenAI API key not configured')
    }

    let messages;
    
    if (isImage) {
      // For images, use vision
      messages = [
        {
          role: 'user',
          content: [
            { type: 'text', text: extractionPrompt },
            { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64Data}`, detail: 'low' } }
          ]
        }
      ]
    } else {
      // For PDFs, send as image (works for scanned receipts)
      messages = [
        {
          role: 'user',
          content: [
            { type: 'text', text: extractionPrompt },
            { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64Data}`, detail: 'low' } }
          ]
        }
      ]
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500
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