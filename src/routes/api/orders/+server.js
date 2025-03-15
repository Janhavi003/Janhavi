export async function GET({ request }) {
    // Retrieve the Authorization header from the request
    const authHeader = request.headers.get("Authorization");

    console.log("Received Auth Header:", authHeader);

    // Validate if the Authorization header exists and has the correct format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized - Invalid token format" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        // Make a GET request to fetch orders from the external API
        const apiResponse = await fetch("https://api-tst.trymighty.com/v2/orders", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": authHeader 
            }
        });

        console.log("Orders API Response Status:", apiResponse.status);

        // Handle errors returned by the API
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

        // Parse and return the response data if the request was successful
        const data = await apiResponse.json();
        console.log("Orders Data:", JSON.stringify(data).substring(0, 200) + "..."); 
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error fetching orders:", error);

        // Handle unexpected server errors
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
