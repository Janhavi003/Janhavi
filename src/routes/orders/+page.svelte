<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    
    let orders = [];
    let loading = true;
    let errorMessage = "";
    let debugInfo = null;

    async function fetchOrders() {
        const token = localStorage.getItem("authToken");

        if (!token) {
            errorMessage = "❌ Authorization token not found. Please sign in again.";
            console.error("No token found in localStorage");
            loading = false;
            return;
        }

        console.log("Token from localStorage (first 10 chars):", token.substring(0, 10) + "...");

        try {
            console.log("Sending request to /api/orders");
            const response = await fetch("/api/orders", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("Orders API client response:", {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            const data = await response.json();
            console.log("Orders response data:", data);

            if (!response.ok) {
                debugInfo = data;
                throw new Error(`API Error: ${data.error || response.statusText}`);
            }

            orders = Array.isArray(data) ? data : data.orders || [];
            console.log(`Loaded ${orders.length} orders`);
        } catch (error) {
            errorMessage = `❌ ${error.message}`;
            console.error("Error in fetchOrders:", error);
        } finally {
            loading = false;
        }
    }

    function viewOrder(orderId) {
        goto(`/orders/${orderId}`);
    }

    function retryFetch() {
        loading = true;
        errorMessage = "";
        debugInfo = null;
        fetchOrders();
    }

    function goToLogin() {
        goto("/login");
    }

    onMount(fetchOrders);
</script>

<div class="container mx-auto p-6 space-y-4">
    <h1 class="text-xl font-semibold mb-4">Your Orders</h1>

    {#if loading}
        <div class="flex justify-center items-center space-x-2">
            <div class="w-8 h-8 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            <p>Loading orders...</p>
        </div>
    {:else if errorMessage}
        <div class="bg-red-100 text-red-700 px-4 py-3 rounded-lg border border-red-400">
            <p>{errorMessage}</p>
            <div class="flex space-x-4 mt-4">
                <button on:click={retryFetch} class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Retry</button>
                <button on:click={goToLogin} class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Sign In Again</button>
            </div>
        </div>
    {:else if orders.length === 0}
        <p class="text-gray-500">No orders found.</p>
    {:else}
        <ul>
            {#each orders as order}
                <li class="border p-4 my-2 flex justify-between items-center bg-white rounded-lg shadow-md hover:shadow-lg transition">
                    <span class="font-medium text-gray-700">Order #{order.id}: {order.status?.name || "Unknown Status"}</span>
                    <button on:click={() => viewOrder(order.id)} class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        View Details
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
</div>
