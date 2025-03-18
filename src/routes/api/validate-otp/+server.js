/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
    const { phone, otp } = await request.json();
    console.log("Received OTP validation request:", { phone, otp });

    const API_BASE = 'https://api-tst.trymighty.com/v2';
    const endpoint = '/collaborators?action=validate-otp';

    try {
        // Request body for OTP validation
        const body = { phone, otp };

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

        // If no content (status 204), return a response with no body
        if (response.status === 204) {
            return new Response(null, { status: 204 });
        }

        // Try to parse response as JSON
        let data;
        try {
            data = await response.json();
        } catch (error) {
            // Log the error to the console if parsing JSON fails
            console.error("Error parsing response JSON:", error);
            return new Response(
                JSON.stringify({ error: 'Failed to parse API response' }),
                { status: 500 }
            );
        }

        // Check if OTP is invalid
        if (response.status === 400) {
            return new Response(
                JSON.stringify({ error: 'Invalid OTP' }),
                { status: 400 }
            );
        }

        // Generate JWT Token (for demonstration)
        const token = "generated-jwt-token";  // Replace with actual JWT generation logic

        // Include token in the response
        return new Response(
            JSON.stringify({
                message: 'OTP validated successfully',
                token,
                userData: data  // Here 'data' is the response from the API
            }),
            { status: response.status }
        );

    } catch (error) {
        // Log the error to the console if an exception occurs
        console.error("Error validating OTP:", error);

        return new Response(
            JSON.stringify({
                error: 'Internal Server Error',
                message: error.message || error.toString(),
            }),
            { status: 500 }
        );
    }
}
