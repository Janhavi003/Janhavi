<script>
    import { onMount } from 'svelte';

    let orders = [];
    let error = null;

    async function fetchOrders() {
        try {
            const response = await fetch('/api/orders'); // This is your own backend endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            orders = await response.json();
        } catch (err) {
            error = err.message;
            console.error('Error fetching orders:', err);
        }
    }

    onMount(() => {
        fetchOrders();
    });
</script>

<!-- UI -->
<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-80">
        <h1 class="text-xl font-bold mb-4">Orders</h1>
        {#if error}
            <p class="text-red-500">{error}</p>
        {/if}
        {#if orders.length === 0}
            <p>No orders available.</p>
        {/if}
        <ul>
            {#each orders as order}
                <li class="mb-2">{order.description}</li> <!-- Adjust the display as needed -->
            {/each}
        </ul>
    </div>
</div>
