export async function POST({ request }) {  
    try {
        // Parse the request body to extract phone number and OTP
        const { phone, otp } = await request.json();

        // Validate if all required fields are present
        if (!phone?.countryCode || !phone?.number || !otp?.code) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // Send OTP validation request to the external API
        const response = await fetch("https://api-tst.trymighty.com/v2/collaborators?action=validate-otp", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json" 
            },
            body: JSON.stringify({ phone, otp })
        });

        // Handle successful OTP validation
        if (response.status === 204) {
            return new Response(JSON.stringify({ token: "your-secure-jwt-token" }), { status: 200 });
        } 

        // Handle OTP validation failure
        const errorData = await response.json();
        return new Response(JSON.stringify({ error: errorData.error || "OTP validation failed" }), { status: response.status });
    } catch (error) {
        console.error("Error in validate-otp:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}