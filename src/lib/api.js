// api.js

export async function requestOTP(phoneNumber, countryCode) {
    try {
        const response = await fetch('/api/request-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: {
                    countryCode,
                    number: phoneNumber
                }
            }),
        });

        if (response.status === 204) {
            return { success: true };
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error occurred while requesting OTP');
        }
    } catch (error) {
        throw new Error(error.message || 'Unknown error while requesting OTP');
    }
}
