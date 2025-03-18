<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let order = null;
    let orderItems = [];
    let error = null;
    let token = null;
    let orderId = '';
    let showCancelModal = false;  // Initialize the modal visibility variable

    // Fetch the order details once the component is mounted
    onMount(() => {
        if (typeof window !== "undefined") {
            token = localStorage.getItem('authToken');
        }
        orderId = $page.params.id;
        fetchOrderDetails();
    });

    // Function to fetch order details
    async function fetchOrderDetails() {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch order details');
            const data = await response.json();
            order = data;  // Store the order data
            orderItems = data.items;  // Store the order items
        } catch (err) {
            error = err.message;
        }
    }

    // Close the confirmation modal
    function closeModal() {
        showCancelModal = false;
    }

    // Confirm the cancel order action
    async function confirmCancel() {
        try {
            const response = await fetch(`/api/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to cancel the order');
            closeModal();
            goto('/orders');
        } catch (err) {
            error = err.message;
        }
    }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
    <!-- Logo header -->
    {#if order}
        <div class="flex gap-x-2 p-5">
            <img src="/assets/Logo.svg" alt="Logo"> 
            <h1 class="text-[1.3rem] font-bold">MIGHTY X ABRA</h1>
        </div>
        <div class="flex justify-center items-center">
            <div class="bg-white w-[500px] mt-20 rounded-lg shadow-md p-[40px] space-y-8">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-semibold">Order Details</h2>
                    <h2 class="text-2xl font-semibold">Price</h2>
                </div>
                <div class="border-b-2 border-gray-200"></div>
                <div class="flex justify-between py-4">
                    <div class="space-y-3">
                        <h2 class="text-xl font-semibold">{order.offer.name}</h2>
                        <h3 class="text-sm text-gray-500">Quantity: {order.quantity}</h3>
                        <h3 class="text-sm text-gray-500">Order ID: {order.order.id}</h3>
                        <h3 class="text-sm text-gray-500">Reference: {order.offer.reference}</h3>
                    </div>
                    <div class="space-y-3 text-right">
                        <h2 class="text-lg">Price: ${order.price.toFixed(2)}</h2>
                        <h2 class="text-lg">VAT: ${Number(order.vat).toFixed(2)}</h2>
                        <h2 class="text-xl font-semibold">Total: ${(Number(order.price) + Number(order.vat)).toFixed(2)}</h2>
                    </div>
                </div>
                <div class="border-b-2 border-gray-200"></div>
                <div class="flex justify-around gap-4 pt-4">
                    <button 
                        on:click={() => goto('/orders')} 
                        class="w-full text-black hover:text-white hover:bg-black bg-white border-2 px-4 py-3 border-black rounded-lg transition-colors duration-200"
                    >
                        Back to Orders
                    </button>
                    <button 
                        on:click={() => showCancelModal = true} 
                        class="w-full text-red-500 bg-white border-2 px-4 py-3 border-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-200"
                    >
                        Cancel Order
                    </button>
                </div>
            </div>
        </div>
    {:else if error}
        <div class="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</div>
    {:else}
        <div class="text-center p-4 bg-gray-50 rounded-lg">Order not found</div>
    {/if}

    <!-- Confirmation Modal -->
    {#if showCancelModal}
        <div class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
                <h2 class="text-2xl font-bold mb-4">Cancel Order</h2>
                <p class="text-gray-600 mb-6">
                    Are you sure you want to cancel this order?<br>
                    This action cannot be undone.
                </p>
                <div class="flex gap-4">
                    <button 
                        on:click={closeModal}
                        class="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                        No, Keep Order
                    </button>
                    <button 
                        on:click={confirmCancel}
                        class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                        Yes, Cancel Order
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- <style>
    /* Your existing styles that were used in your UI */
    .p-6 {
        padding: 1.5rem;
    }

    .text-[1.3rem] {
        font-size: 1.3rem;
    }

    .font-bold {
        font-weight: 700;
    }

    .bg-gray-900 {
        background-color: #1a202c;
    }

    .text-white {
        color: white;
    }

    .bg-white {
        background-color: white;
    }

    .rounded-lg {
        border-radius: 8px;
    }

    .shadow-md {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .space-y-8 {
        margin-bottom: 2rem;
    }

    .text-2xl {
        font-size: 1.5rem;
    }

    .font-semibold {
        font-weight: 600;
    }

    .border-b-2 {
        border-bottom-width: 2px;
    }

    .border-gray-200 {
        border-color: #e5e7eb;
    }

    .py-4 {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    .space-y-3 {
        margin-bottom: 1rem;
    }

    .text-right {
        text-align: right;
    }

    .text-lg {
        font-size: 1.125rem;
    }

    .text-red-500 {
        color: #f87171;
    }

    .bg-red-500 {
        background-color: #f87171;
    }

    .border-red-500 {
        border-color: #f87171;
    }

    .text-gray-500 {
        color: #6b7280;
    }

    .rounded-lg {
        border-radius: 0.375rem;
    }

    .transition-colors {
        transition: background-color 0.2s, color 0.2s;
    }

    .duration-200 {
        transition-duration: 200ms;
    }

    .hover\:bg-black:hover {
        background-color: #000000;
    }

    .hover\:bg-red-500:hover {
        background-color: #f87171;
    }

    .hover\:text-white:hover {
        color: white;
    }

    .hover\:text-black:hover {
        color: black;
    }
</style> -->
