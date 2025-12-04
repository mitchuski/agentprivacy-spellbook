/**
 * Cloudflare Worker to proxy NEAR AI API requests
 * This bypasses CORS restrictions
 * 
 * Deploy this as a Cloudflare Worker, then set:
 * NEXT_PUBLIC_NEAR_PROXY_URL=https://your-worker.your-subdomain.workers.dev
 */

export default {
  async fetch(request, env) {
    // Get the origin from the request (allow all origins for now)
    const origin = request.headers.get('Origin') || '*';
    
    // CORS headers to use for all responses - explicitly set each header
    const corsHeaders = new Headers();
    corsHeaders.set('Access-Control-Allow-Origin', origin === '*' ? '*' : origin);
    corsHeaders.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    corsHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    corsHeaders.set('Access-Control-Max-Age', '86400');
    corsHeaders.set('Access-Control-Allow-Credentials', 'false');

    // Handle CORS preflight (OPTIONS request)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Get the API key from environment (set in Cloudflare Worker settings)
    const NEAR_API_KEY = env.NEAR_API_KEY;
    
    if (!NEAR_API_KEY) {
      const errorHeaders = new Headers(corsHeaders);
      errorHeaders.set('Content-Type', 'application/json');
      return new Response(JSON.stringify({ error: 'NEAR_API_KEY not configured in Worker' }), {
        status: 500,
        headers: errorHeaders,
      });
    }

    // Parse the request URL
    const url = new URL(request.url);
    const path = url.pathname;
    const search = url.search;

    // Forward to NEAR AI
    const nearUrl = `https://cloud-api.near.ai${path}${search}`;
    
    // Get request body if it exists
    let body = null;
    if (request.method === 'POST' || request.method === 'PUT') {
      body = await request.text();
    }

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

    // Create response headers with CORS
    const responseHeaders = new Headers(corsHeaders);
    responseHeaders.set('Content-Type', contentType);

    // Return response with CORS headers
    return new Response(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  },
};

