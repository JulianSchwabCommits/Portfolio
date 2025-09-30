export async function onRequestPost({ request, env }) {
  try {
    // Parse the request body
    const { messages, systemPrompt } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format the conversation for Gemini API
    const conversationText = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\nConversation history:\n${conversationText}` : conversationText;

    // Make request to Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', errorData);
      return new Response(JSON.stringify({ 
        error: `Gemini API error: ${response.status}`,
        details: errorData 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();

    // Validate response format
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return new Response(JSON.stringify({ error: 'Invalid response format from Gemini API' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return the response
    return new Response(JSON.stringify({
      text: data.candidates[0].content.parts[0].text
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle CORS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}