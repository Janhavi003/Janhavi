export async function POST({ request }) {
    try {
        // Parse the request body to extract phone details
        const { phone } = await request.json();

        // Check if the required phone details are provided
        if (!phone || !phone.number || !phone.countryCode) {
            return new Response(JSON.stringify({ error: "Missing phone details" }), { status: 400 });
        }

        // Send OTP request to the external API
        const response = await fetch("https://api-tst.trymighty.com/v2/collaborators?action=request-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }) 
        });

        // If the response status is 204, OTP request was successful
        if (response.status === 204) {
            return new Response(null, { status: 204 });
        } else {
            // If the response contains an error, parse and return it
            const errorData = await response.json();
            return new Response(JSON.stringify({ error: errorData.error || "OTP request failed" }), { status: response.status });
        }
    } catch (error) {
        console.error("Error in request-otp:", error);

        // Return a generic internal server error response
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
