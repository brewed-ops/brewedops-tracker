// supabase/functions/gmail-callback/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')

    // Parse state to get userId and returnUrl
    let stateData = { userId: '', returnUrl: '' }
    try {
      stateData = JSON.parse(atob(state || ''))
    } catch (e) {
      console.error('Failed to parse state:', e)
    }

    const appUrl = stateData.returnUrl || Deno.env.get('APP_URL') || 'https://brewedops.com'

    if (error) {
      return Response.redirect(`${appUrl}?gmail_error=${error}`, 302)
    }

    if (!code || !stateData.userId) {
      return Response.redirect(`${appUrl}?gmail_error=missing_params`, 302)
    }

    // Exchange code for tokens
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const redirectUri = `${supabaseUrl}/functions/v1/gmail-callback`

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    const tokens = await tokenResponse.json()

    if (tokens.error) {
      console.error('Token error:', tokens)
      return Response.redirect(`${appUrl}?gmail_error=token_failed`, 302)
    }

    // Get user's email from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    })
    const userInfo = await userInfoResponse.json()

    // Store tokens in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        gmail_access_token: tokens.access_token,
        gmail_refresh_token: tokens.refresh_token,
        gmail_email: userInfo.email,
        gmail_connected_at: new Date().toISOString()
      })
      .eq('user_id', stateData.userId)

    if (updateError) {
      console.error('Database update error:', updateError)
      return Response.redirect(`${appUrl}?gmail_error=db_failed`, 302)
    }

    // Redirect back to app with success
    return Response.redirect(`${appUrl}?gmail_connected=true&gmail_email=${encodeURIComponent(userInfo.email)}`, 302)

  } catch (error) {
    console.error('Callback error:', error)
    const appUrl = Deno.env.get('APP_URL') || 'https://brewedops.com'
    return Response.redirect(`${appUrl}?gmail_error=unknown`, 302)
  }
})