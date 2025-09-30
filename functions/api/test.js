export async function onRequestGet({ env }) {
  return new Response(JSON.stringify({
    status: 'Chat API endpoint is working',
    hasApiKey: !!env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}