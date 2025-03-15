export async function POST({ request }) {
    try {
        const { phone } = await request.json();

        if (!phone || !phone.number || !phone.countryCode) {
            return new Response(JSON.stringify({ error: "Missing phone details" }), { status: 400 });
        }

        const response = await fetch("https://api-tst.trymighty.com/v2/collaborators?action=request-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone })
        });

        if (response.status === 204) {
            return new Response(null, { status: 204 });
        } else {
            const errorData = await response.json();
            return new Response(JSON.stringify({ error: errorData.error || "OTP request failed" }), { status: response.status });
        }
    } catch (error) {
        console.error("Error in request-otp:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
