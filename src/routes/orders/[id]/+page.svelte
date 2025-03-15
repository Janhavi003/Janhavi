<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
  
    // Variables to store user input and UI state
    let order = null; // Holds the order details
    let orderItems = []; // Stores the items in the order
    let token = localStorage.getItem('authToken') || ''; // Retrieve the authentication token from localStorage
    let orderId = ''; // Order ID extracted from the URL
  
    // Subscribe to the `page` store to get order ID from the URL
    const unsubscribe = page.subscribe(($page) => {
        orderId = $page.params.id;
        if (orderId && token) {
            fetchOrderDetails(); 
        }
    });
  
    // Function to fetch order details and order items from the API
    async function fetchOrderDetails() {
        try {
            console.log("Fetching Order Details...");
  
            // Fetch order details
            const orderResponse = await fetch(`/api/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
  
            if (orderResponse.ok) {
                order = await orderResponse.json(); 
            } else {
                console.error('Failed to fetch order details');
            }
  
            // Fetch order items
            const itemsResponse = await fetch(`/api/orders/${orderId}/items`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
  
            if (itemsResponse.ok) {
                orderItems = await itemsResponse.json(); 
            } else {
                console.error('Failed to fetch order items');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    }
  
    // Function to cancel the order
    async function cancelOrder() {
        try {
            console.log("Cancelling Order...");
  
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: { id: 0 } 
                })
            });
  
            if (response.ok) {
                alert('Order canceled successfully!');
                fetchOrderDetails(); 
            } else {
                console.error('Failed to cancel order');
                alert('Failed to cancel order. Please try again.');
            }
        } catch (error) {
            console.error('Error canceling order:', error);
            alert('An error occurred while canceling the order.');
        }
    }
</script>
  
<div class="p-6">
    <!-- Back to Orders button -->
    <button on:click={() => goto('/orders')} class="mb-4 text-blue-500 hover:underline">Back to Orders</button>

    {#if order}
        <!-- Display order ID and status -->
        <h1 class="text-2xl font-bold mb-2">Order #{orderId}</h1>
        <p class="text-gray-700 mb-4">Status: {order.status}</p>

        <!-- Display order items -->
        <h2 class="text-lg font-semibold mb-2">Order Items:</h2>
        {#if orderItems.length > 0}
            <ul class="list-disc pl-4 mb-4">
                {#each orderItems as item}
                    <li>{item.name} - {item.quantity}</li>
                {/each}
            </ul>
        {:else}
            <p class="text-gray-500">No items found in this order.</p>
        {/if}

        <!-- Cancel Order button -->
        <button on:click={cancelOrder} class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4 w-full">
            Cancel Order
        </button>
    {/if}
</div>
