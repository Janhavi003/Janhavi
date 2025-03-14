export async function POST({ request }) {
  try {
    const { phone } = await request.json();  // Extract phone object from the body

    // Validate the input data
    if (!phone || !phone.countryCode || !phone.number) {
      return new Response(
        JSON.stringify({ error: "Missing countryCode or phoneNumber" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const requestData = {
      phone: phone
    };

    // Make the request to the external API
    const response = await fetch('https://api-tst.trymighty.com/v2/collaborators?action=request-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY_HERE' // Replace with your actual API key
      },
      body: JSON.stringify(requestData)
    });

    // Log the API response for debugging
    const responseText = await response.text();
    console.log('API Response:', response.status, responseText);

    if (response.ok) {
      // Return a success response (no content)
      return new Response(null, { status: 204 });
    } else {
      // If the external API fails, return the error message
      return new Response(responseText, { status: response.status });
    }
  } catch (error) {
    console.error('Error forwarding request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
