export async function POST({ request }) {  // ✅ Ensure POST method exists
    try {
        const { phone, otp } = await request.json();

        if (!phone || !phone.number || !phone.countryCode || !otp || !otp.code) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const response = await fetch("https://api-tst.trymighty.com/v2/collaborators?action=validate-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, otp })
        });

        if (response.status === 204) {
            const token = "your-secure-jwt-token";  // ✅ Replace with real JWT
            return new Response(JSON.stringify({ token }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            const errorData = await response.json();
            return new Response(JSON.stringify({ error: errorData.error || "OTP validation failed" }), {
                status: response.status,
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (error) {
        console.error("Error in validate-otp:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
