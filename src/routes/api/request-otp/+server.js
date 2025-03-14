export async function POST({ request }) {
    try {
        const requestData = await request.json();
        const response = await fetch('https://api-tst.trymighty.com/v2/collaborators?action=request-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        return new Response(null, { status: response.status });
    } catch (error) {
        console.error('Error forwarding request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
