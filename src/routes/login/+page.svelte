<script>
    import { goto } from '$app/navigation';
  
    let countryCode = '';
    let phoneNumber = '';
  
    async function requestOTP() {
    try {
      const response = await fetch('/api/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: { countryCode, number: phoneNumber }
        })
      });
  
      if (response.status === 204) {
        goto(`/otp?countryCode=${countryCode}&phoneNumber=${phoneNumber}`);
      } else {
        alert('Failed to request OTP.');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      alert('An error occurred.');
    }
  }
  
  </script>
  
  <!-- UI -->
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-80">
      <h1 class="text-xl font-bold mb-4">Login</h1>
      <input bind:value={countryCode} placeholder="Country Code" class="border p-2 w-full mb-2" />
      <input bind:value={phoneNumber} placeholder="Mobile Number" class="border p-2 w-full mb-4" />
      <button on:click={requestOTP} class="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
        Request OTP
      </button>
    </div>
  </div>
 
