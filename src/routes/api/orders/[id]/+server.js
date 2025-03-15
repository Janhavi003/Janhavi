export async function GET({ request, params }) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    try {
        const response = await fetch(`https://api-tst.trymighty.com/v2/orders/${params.id}`, {
            headers: { "Authorization": authHeader }
        });

        if (response.ok) {
            const data = await response.json();
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Failed to fetch order" }), { status: response.status });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
    }
}
