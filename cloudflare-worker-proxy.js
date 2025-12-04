/**
 * Cloudflare Worker to proxy NEAR AI API requests
 * This bypasses CORS restrictions
 * 
 * Deploy this as a Cloudflare Worker, then set:
 * NEXT_PUBLIC_NEAR_PROXY_URL=https://your-worker.your-subdomain.workers.dev
 */

export default {
  async fetch(request, env) {
    // Get origin from request
    const origin = request.headers.get('Origin') || '*';
    
    // CORS headers - always include these
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin === '*' ? '*' : origin,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight (OPTIONS request) - MUST return 204 with headers
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        statusText: 'No Content',
        headers: corsHeaders,
      });
    }

    // Get the API key from environment
    const NEAR_API_KEY = env.NEAR_API_KEY;
    
    if (!NEAR_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'NEAR_API_KEY not configured in Worker' }), 
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Parse the request URL
    const url = new URL(request.url);
    const path = url.pathname;
    const search = url.search;

    // If root path, return info message (for testing)
    if (path === '/' || path === '') {
      return new Response(
        JSON.stringify({ 
          message: 'NEAR AI Proxy Worker is active',
          endpoint: 'Use /v1/chat/completions for NEAR AI API'
        }), 
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Forward to NEAR AI
    const nearUrl = `https://cloud-api.near.ai${path}${search}`;
    
    // Get request body if it exists
    let body = null;
    if (request.method === 'POST' || request.method === 'PUT') {
      body = await request.text();
    }

    try {
      // Forward request to NEAR AI
      const response = await fetch(nearUrl, {
        method: request.method,
        headers: {
          'Authorization': `Bearer ${NEAR_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body,
      });

      // Get response data
      const responseData = await response.text();
      const contentType = response.headers.get('content-type') || 'application/json';

      // Return response with CORS headers - ALWAYS include CORS
      return new Response(responseData, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'Content-Type': contentType,
          ...corsHeaders,
        },
      });
    } catch (error) {
      // Error response with CORS headers - ALWAYS include CORS
      return new Response(
        JSON.stringify({ error: error.message }), 
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
  },
};
