export async function GET({ request }) {
    const authHeader = request.headers.get("Authorization");

    console.log("Received Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized - Invalid token format" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        // ✅ Try fetching without query params first
        const apiResponse = await fetch("https://api-tst.trymighty.com/v2/orders", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": authHeader
            }
        });

        console.log("Orders API Response Status:", apiResponse.status);

        if (!apiResponse.ok) {
            const errorData = await apiResponse.text();
            console.error("API Error Response:", errorData);

            return new Response(JSON.stringify({ 
                error: "Failed to fetch orders", 
                status: apiResponse.status,
                details: errorData
            }), {
                status: apiResponse.status,
                headers: { "Content-Type": "application/json" }
            });
        }

        const data = await apiResponse.json();
        console.log("Orders Data:", JSON.stringify(data).substring(0, 200) + "...");

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
