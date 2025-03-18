export async function GET({ request, params }) {
    // Retrieve the Authorization header from the incoming request
    const authHeader = request.headers.get("Authorization");

    // If the Authorization header is missing, return a 401 Unauthorized response
    if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        // Construct the API URL using the order ID from the request parameters
        const response = await fetch(`https://api-tst.trymighty.com/v2/orders/${params.id}`, {
            method: "GET",
            headers: { 
                "Authorization": authHeader,
                "Accept": "application/json"
            }
        });

        // If the request is successful, return the order data
        if (!response.ok) {
            const errorData = await response.text();
            return new Response(JSON.stringify({ error: "Failed to fetch order", details: errorData }), { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
    }
}
