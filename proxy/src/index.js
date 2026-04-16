/**
 * Cloudflare Worker for Groq AI Chat Widget Proxy
 * 
 * This securely proxies requests from the Orange Bytes frontend 
 * to the Groq API without exposing the API key in the browser.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allows requests from any frontend domain
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default {
  async fetch(request, env) {
    // 1. Handle CORS Preflight request from the browser
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      // 3. Read the payload from the frontend website
      const payload = await request.json();

      // 4. Forward the payload securely to Groq
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GROQ_API_KEY}`, // Hidden Secret injected securely!
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await groqResponse.json();

      // 5. Send the API response back down to the frontend
      return new Response(JSON.stringify(data), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
