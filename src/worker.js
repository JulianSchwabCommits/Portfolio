// Cloudflare Worker script to add security headers
export default {
  async fetch(request, env, ctx) {
    // Get the response from the origin
    const response = await fetch(request);
    
    // Clone the response so we can modify headers
    const newResponse = new Response(response.body, response);
    
    // Add security headers
    newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    newResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');
    newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
    newResponse.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'self'");
    
    return newResponse;
  },
};
