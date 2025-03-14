export async function POST({ request }) {
    try {
      // Extract countryCode, phoneNumber, and OTP from the request body
      const { countryCode, phoneNumber, otp } = await request.json();
  
      // Check if all required fields are provided
      if (!countryCode || !phoneNumber || !otp) {
        return new Response(
          JSON.stringify({ error: "Missing required fields (countryCode, phoneNumber, otp)" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Prepare the request body for the external API
      const requestBody = {
        phone: { countryCode, number: phoneNumber },
        otp: { code: otp }
      };
  
      // Make the API call to validate the OTP
      const response = await fetch('https://api-tst.trymighty.com/v2/collaborators?action=validate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY_HERE' // Replace with your actual API key
        },
        body: JSON.stringify(requestBody)
      });
  
      // Log the API response
      const responseText = await response.text();
      console.log('API Response:', response.status, responseText);
  
      if (response.ok) {
        return new Response(null, { status: 204 });  // Success (No Content)
      } else {
        return new Response(responseText, { status: response.status });  // Forward error message
      }
    } catch (error) {
      console.error('Error forwarding request:', error);
      return new Response(
        JSON.stringify({ error: 'Internal Server Error', details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  