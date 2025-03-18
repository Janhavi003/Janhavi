/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
  const { phone } = await request.json();
  console.log("Received OTP request:", phone);

  // External API base URL (you can change it based on your configuration)
  const API_BASE = 'https://api-tst.trymighty.com/v2';
  const endpoint = '/collaborators?action=request-otp'; // Endpoint for OTP request

  try {
      // Prepare request body for OTP generation
      const body = { phone };

      const headers = {
          "Content-Type": "application/json",
          "Accept": "application/json"
      };

      const response = await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
      });

      console.log("API Response Status:", response.status);

      if (response.status === 204) {
          // No content response, OTP request successful
          return new Response(null, { status: 204 });
      }

      // For other statuses, ensure a valid JSON response
      let data;
      try {
          data = await response.json();
      } catch {
          // Handle unexpected non-JSON responses gracefully
          return new Response(
              JSON.stringify({ error: 'Failed to parse API response' }),
              { status: 500 }
          );
      }

      // Return the data or error message
      return new Response(
          JSON.stringify(data),
          { status: response.status }
      );
  } catch (error) {
      console.error("Error requesting OTP:", error);
      return new Response(
          JSON.stringify({
              error: 'Internal Server Error',
              message: error.message || error.toString(),
          }),
          { status: 500 }
      );
  }
}
