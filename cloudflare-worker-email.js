/**
 * Cloudflare Worker for sending emails via Resend API
 * 
 * Deploy this to Cloudflare Workers:
 * 1. Go to Cloudflare Dashboard > Workers & Pages
 * 2. Create a new Worker
 * 3. Paste this code
 * 4. Add environment variable: RESEND_API_KEY
 * 5. Deploy
 * 
 * Then set NEXT_PUBLIC_EMAIL_API_URL to your worker URL
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const body = await request.json();
      const { to, from, subject, text, replyTo } = body;

      // Validate required fields
      if (!to || !from || !subject || !text) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: to, from, subject, text' }),
          { 
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to) || !emailRegex.test(from)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { 
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Check if Resend API key is configured
      if (!env.RESEND_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'Email service not configured' }),
          { 
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Send email via Resend API
      // Using verified domain cast.agentprivacy.ai
      const fromEmail = 'AgentPrivacy <noreply@cast.agentprivacy.ai>';
      
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          reply_to: replyTo || from,
          subject: subject,
          text: text,
        }),
      });

      const resendData = await resendResponse.json();

      if (!resendResponse.ok) {
        console.error('Resend API error:', resendData);
        // Return more detailed error for debugging
        const errorMessage = resendData.message || resendData.error?.message || 'Failed to send email';
        return new Response(
          JSON.stringify({ 
            error: errorMessage,
            details: resendData.error || resendData,
            status: resendResponse.status
          }),
          { 
            status: resendResponse.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Success
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully',
          id: resendData.id,
        }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ error: error.message || 'Internal server error' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};

