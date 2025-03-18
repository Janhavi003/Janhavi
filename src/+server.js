// +server.js (in your `src/routes/api/request-otp/+server.js`)

// POST /api/request-otp
export async function POST({ request }) {
    const { phone } = await request.json();
    const { countryCode, number } = phone;

    const API_BASE = 'https://api-tst.trymighty.com/v2';
    const endpoint = '/collaborators?action=request-otp';

    try {
        const body = {
            phone: {
                countryCode,
                number
            }
        };

        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const status = response.status;

        if (status === 204) {
            // OTP request successful
            return new Response(null, { status: 204 });
        } else {
            const data = await response.json();
            return new Response(JSON.stringify(data), { status: status });
        }
    } catch (error) {
        console.error('Error requesting OTP:', error);
        return new Response(
            JSON.stringify({
                error: 'Internal Server Error',
                message: error.message || error.toString(),
            }),
            { status: 500 }
        );
    }
}
