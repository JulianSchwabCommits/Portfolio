import reasons from '../../src/data/reasons.json';

// GET endpoint to fetch a random "no" reason
export async function onRequestGet({ request }) {
  try {
    // Get a random reason from the array
    const randomIndex = Math.floor(Math.random() * reasons.length);
    const randomReason = reasons[randomIndex];

    return new Response(JSON.stringify({ 
      reason: randomReason,
      // Return 1-based index for human-readable display
      index: randomIndex + 1,
      total: reasons.length
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        // Don't cache so we get random reasons each time
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('No API error:', error);
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
