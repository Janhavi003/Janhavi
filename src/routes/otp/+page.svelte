<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let otp = '';
  let countryCode = '';
  let phoneNumber = '';

  // Get countryCode and phoneNumber from URL query params
  let urlParams = new URLSearchParams(get(page).url.search);
  countryCode = urlParams.get('countryCode') || '';
  phoneNumber = urlParams.get('phoneNumber') || '';

  async function validateOTP() {
    try {
      // Validate OTP by sending a request to the backend API
      const response = await fetch('/api/validate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode,
          phoneNumber,
          otp
        })
      });

      const responseText = await response.text();
      console.log('API Response:', response.status, responseText);

      if (response.ok) {
        // Redirect to orders page if OTP is valid
        goto(`/orders?countryCode=${countryCode}&phoneNumber=${phoneNumber}`);
      } else {
        // Show error message if OTP is invalid
        alert(JSON.parse(responseText).message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
      alert('An error occurred while validating the OTP.');
    }
  }
</script>

<!-- UI for OTP Input -->
<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <div class="bg-white p-6 rounded-lg shadow-md w-80">
    <h1 class="text-xl font-bold mb-4">Enter OTP</h1>
    <input bind:value={otp} placeholder="Enter OTP" class="border p-2 w-full mb-4" />
    <button on:click={validateOTP} class="bg-blue-500 text-white px-4 py-2 rounded w-full">
      Validate OTP
    </button>
  </div>
</div>
