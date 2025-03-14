<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { get } from 'svelte/store';
  
    let otp = '';
  
    // Get countryCode and phoneNumber from URL query params
    let urlParams = new URLSearchParams(get(page).url.search);
    let countryCode = urlParams.get('countryCode') || '';
    let phoneNumber = urlParams.get('phoneNumber') || '';
  
    async function validateOTP() {
      const response = await fetch('https://api-tst.trymighty.com/v2/collaborators?action=validate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: { countryCode, number: phoneNumber },
          otp: { code: otp }
        })
      });
  
      if (response.status === 204) {
        // Navigate to the orders page after successful OTP verification
        goto(`/orders?countryCode=${countryCode}&phoneNumber=${phoneNumber}`);
      } else {
        alert('Invalid OTP');
      }
    }
  </script>
  
  <!-- UI -->
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-80">
      <h1 class="text-xl font-bold mb-4">Enter OTP</h1>
      <input bind:value={otp} placeholder="Enter OTP" class="border p-2 w-full mb-4" />
      <button on:click={validateOTP} class="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Validate OTP
      </button>
    </div>
  </div>
