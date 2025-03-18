<script context="module">
  // Using the load function for SSR
  export async function load({ fetch, session }) {
    const token = session?.auth?.token;

    // If there's no token, redirect to the OTP page for authentication
    if (!token) {
      return {
        status: 401,
        error: new Error('Unauthorized - Token missing'),
      };
    }

    try {
      const queryParams = new URLSearchParams({
        onlyOrders: 'true',
        period: 'TODAY',
      }).toString();

      const requestURL = `/api/v2/orders?${queryParams}`;

      const res = await fetch(requestURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }

      const orders = await res.json();
      return { props: { orders } };
    } catch (error) {
      return {
        status: 500,
        error: new Error('Error loading orders'),
      };
    }
  }
</script>

<script>
  export let orders = [];
  let filteredOrders = [];
  let searchQuery = '';
  let orderStatus = '';
  let isLoading = false;
  let errorMessage = '';

  // Order status filters
  const statusFilters = [
    { id: '', name: 'All Orders' },
    { id: '0', name: 'Cancelled' },
    { id: '9', name: 'Paid' },
    { id: '10', name: 'Pending Payment' },
    { id: '12', name: 'Fulfilled' },
  ];

  // Reactive statement to filter orders based on search query and status
  $: {
    filteredOrders = orders.filter((order) => {
      const matchesSearch =
        order.customer?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !orderStatus || order.status.id.toString() === orderStatus;
      return matchesSearch && matchesStatus;
    });
  }

  // Format date for order creation
  function formatOrderDate(date) {
    return new Date(date).toLocaleString();
  }

  // Get the order status label
  function getOrderStatusLabel(statusId) {
    const status = statusFilters.find((s) => s.id === statusId.toString());
    return status ? status.name : 'Unknown';
  }

  // Get the status color class
  function getStatusClass(statusId) {
    switch (statusId) {
      case 0:
        return 'bg-red-100 text-red-600';
      case 9:
        return 'bg-green-100 text-green-600';
      case 10:
        return 'bg-yellow-100 text-yellow-600';
      case 12:
        return 'bg-purple-100 text-purple-600';
      default:
        return 'text-gray-600';
    }
  }
</script>

<!-- UI -->
<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <div class="bg-white p-6 rounded-lg shadow-md w-80">
    <h1 class="text-xl font-bold mb-4">Orders</h1>

    <!-- Error Message -->
    {#if errorMessage}
      <p class="text-red-500 mb-4">{errorMessage}</p>
    {/if}

    <!-- Loading Indicator -->
    {#if isLoading}
      <p>Loading orders...</p>
    {/if}

    <!-- Orders List -->
    {#if filteredOrders.length === 0}
      <p>No orders available.</p>
    {/if}

    <div>
      <!-- Filter Section -->
      <input
        type="text"
        placeholder="Search by customer name"
        class="w-full p-3 border-2 border-gray-300 rounded-lg mb-4"
        bind:value={searchQuery}
      />

      <select
        class="w-full p-3 border-2 border-gray-300 rounded-lg mb-4"
        bind:value={orderStatus}
      >
        {#each statusFilters as { id, name }}
          <option value={id}>{name}</option>
        {/each}
      </select>

      <!-- Displaying Orders -->
      <ul>
        {#each filteredOrders as order (order.id)}
          <li class="mb-4 p-4 border-b-2 border-gray-300 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-semibold">{order.customer?.name || 'Anonymous'}</h3>
                <p class="text-sm text-gray-500">#{order.id}</p>
              </div>
              <div
                class={`px-2 py-1 rounded-full text-xs ${getStatusClass(order.status.id)}`}
              >
                {getOrderStatusLabel(order.status.id)}
              </div>
            </div>
            <div class="mt-2 flex justify-between text-sm text-gray-600">
              <p>{formatOrderDate(order.created.at)}</p>
              <p>{order.amount.value.toFixed(2)} {order.amount.currency}</p>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
