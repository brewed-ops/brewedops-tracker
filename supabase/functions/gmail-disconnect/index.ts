// supabase/functions/gmail-disconnect/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get current tokens to revoke
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('gmail_access_token')
      .eq('user_id', userId)
      .single()

    // Revoke token with Google (optional but good practice)
    if (profile?.gmail_access_token) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${profile.gmail_access_token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
      } catch (e) {
        console.log('Token revoke failed (may already be expired):', e)
      }
    }

    // Clear Gmail data from database
    const { error } = await supabase
      .from('user_profiles')
      .update({
        gmail_access_token: null,
        gmail_refresh_token: null,
        gmail_email: null,
        gmail_connected_at: null
      })
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})