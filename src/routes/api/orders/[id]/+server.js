import { json } from '@sveltejs/kit';

export async function GET({ params }) {
    const { id } = params; // Get the order ID from URL parameters

    // Fetch order details from your backend or database
    const order = await getOrderFromDatabase(id);

    // Check if the order exists
    if (!order) {
        return json({ message: 'Order not found' }, { status: 404 });
    }

    // Return the order details and items
    return json(order);
}

// Example function to fetch order data from your database
async function getOrderFromDatabase(orderId) {
    // Simulate fetching order data (replace this with actual database or API calls)
    const mockOrder = {
        order: { id: orderId },
        offer: { name: 'Special Offer', reference: '12345' },
        quantity: 2,
        price: 49.99,
        vat: 10.00,
        items: [
            { name: 'Product 1', quantity: 1 },
            { name: 'Product 2', quantity: 1 },
        ],
    };
    // Replace this with actual database or API logic to fetch order data
    return mockOrder;
}
