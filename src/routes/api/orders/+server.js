export async function GET({ request }) {
    // Retrieve the Authorization header from the request
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized - Invalid token format" }), { status: 401 });
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        // Make a GET request to fetch orders from the external API
        const apiResponse = await fetch("https://api-tst.trymighty.com/v2/orders", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": authHeader
            },
            signal: controller.signal 
        });

        clearTimeout(timeoutId);

        if (!apiResponse.ok) {
            const errorData = await apiResponse.text();
            return new Response(JSON.stringify({ error: "Failed to fetch orders", details: errorData }), { status: apiResponse.status });
        }

        const data = await apiResponse.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        if (error.name === "AbortError") {
            return new Response(JSON.stringify({ error: "Request timeout - External API took too long to respond." }), { status: 504 });
        }
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
    }
}
