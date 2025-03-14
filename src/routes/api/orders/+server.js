export async function GET() {
    try {
        const response = await fetch('https://api-tst.trymighty.com/v2/orders?onlyOrders=TRUE&period=TODAY', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any required authorization headers here, e.g., 'Authorization': 'Bearer <token>'
            },
        });

        if (!response.ok) {
            return new Response('Error fetching orders', { status: response.status });
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Ensure this is set for CORS
            },
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
