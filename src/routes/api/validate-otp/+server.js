export async function POST({ request }) {  
    try {
        //Parse the request body to extract phone number and OTP
        const { phone, otp } = await request.json();

        // Validate if all required fields are present
        if (!phone || !phone.number || !phone.countryCode || !otp || !otp.code) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400, 
                headers: { "Content-Type": "application/json" }
            });
        }

        // Send OTP validation request to the external API
        const response = await fetch("https://api-tst.trymighty.com/v2/collaborators?action=validate-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, otp })
        });

        //  Handle successful OTP validation
        if (response.status === 204) {  
            const token = "your-secure-jwt-token";  
            
            return new Response(JSON.stringify({ token }), {
                status: 200, 
                headers: { "Content-Type": "application/json" }
            });
        } else {
            // Handle OTP validation failure
            const errorData = await response.json();
            return new Response(JSON.stringify({ error: errorData.error || "OTP validation failed" }), {
                status: response.status, 
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (error) {
        console.error("Error in validate-otp:", error);

        //Internal server error handling
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500, 
            headers: { "Content-Type": "application/json" }
        });
    }
}
