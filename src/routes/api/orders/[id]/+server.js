export async function GET({ request, params }) {
    // Retrieve the Authorization header from the incoming request
    const authHeader = request.headers.get("Authorization");

    // If the Authorization header is missing, return a 401 Unauthorized response
    if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        // Construct the API URL using the order ID from the request parameters
        const response = await fetch(`https://api-tst.trymighty.com/v2/orders/${params.id}`, {
            headers: { "Authorization": authHeader } 
        });

        // If the request is successful, return the order data
        if (response.ok) {
            const data = await response.json();
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            // If the request fails, return an error message with the response status
            return new Response(JSON.stringify({ error: "Failed to fetch order" }), { status: response.status });
        }
    } catch (error) {
        // Handle unexpected errors and return a 500 Internal Server Error response
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
    }
}
