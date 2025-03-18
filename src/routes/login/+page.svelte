<script>
    import { goto } from '$app/navigation';
    let otp = '';
    let countryCode = '';
    let phoneNumber = '';
    let isLoading = false;
    let message = '';
    let otpSent = false;

    // Function to request OTP
    async function requestOTP() {
        if (!countryCode || !phoneNumber) {
            message = 'Please enter both country code and phone number';
            return;
        }

        isLoading = true;
        message = '';

        try {
            const response = await fetch('/api/request-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: { countryCode, number: phoneNumber }
                }),
            });

            if (response.status === 204) {
                otpSent = true;
                message = 'OTP has been sent to your phone number.';
            } else {
                const data = await response.json();
                message = `Error: ${data.message || 'Something went wrong'}`;
            }
        } catch (error) {
            console.error('Error requesting OTP:', error);
            message = 'An error occurred while requesting OTP.';
        } finally {
            isLoading = false;
        }
    }

    // Function to validate OTP and store the token
    async function validateOTP() {
    if (!otp) {
        message = 'Please enter the OTP';
        return;
    }

    isLoading = true;
    message = '';

    try {
        const response = await fetch('/api/validate-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: {
                    countryCode,
                    number: phoneNumber
                },
                otp: {
                    code: otp
                }
            }),
        });

        isLoading = false;

        // Check if the response is successful
        if (response.status === 204) {
            message = 'OTP validated successfully. Redirecting to orders page...';
            // Redirect on success
            goto("/orders");
        } else {
            // Handle error responses
            let data;
            try {
                // Check if the response is JSON
                const contentType = response.headers.get("Content-Type");
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    // If it's not JSON, handle accordingly
                    message = "Received an unexpected non-JSON response from the server.";
                    return;
                }
            } catch (error) {
                console.error("Error parsing response:", error);
                message = 'Failed to parse server response.';
                return;
            }

            // Handle the response data (error message)
            if (data.error) {
                message = `Error: ${data.error || 'Invalid OTP'}`;
            } else {
                message = `Error: OTP validation failed, please try again.`;
            }
        }
    } catch (error) {
        console.error('Error validating OTP:', error);
        message = 'An error occurred while validating OTP.';
    } finally {
        isLoading = false;
    }
}

</script>

<!-- HTML for the frontend UI -->
<div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1D1E21] to-[#2A2C30] py-6">
  <div class="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full sm:w-96 border border-white/20">
      <h1 class="text-4xl font-bold text-center text-white mb-6 tracking-wide">Welcome Back</h1>
      <p class="text-gray-300 text-center mb-6">Sign in with your phone number to continue</p>

      <!-- Phone Number Input -->
      <div class="flex gap-2 mb-4">
          <input 
              type="text" 
              bind:value={countryCode} 
              placeholder="+ Code" 
              class="border border-white/30 p-3 w-1/3 text-center rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#E63946]"
          />
          <input 
              type="text" 
              bind:value={phoneNumber} 
              placeholder="Phone Number" 
              class="border border-white/30 p-3 w-2/3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#E63946]"
          />
      </div>

      <!-- Request OTP Button -->
      <button 
          on:click={requestOTP} 
          class="bg-[#E63946] text-white px-6 py-3 rounded-lg w-full mb-4 transition-all transform hover:scale-105 hover:bg-[#C5303E] shadow-lg"
          disabled={isLoading}
      >
          {isLoading ? "Requesting..." : "Request OTP"}
      </button>

      <!-- Display messages (Success/Error) -->
      <p class="mt-2 text-gray-300 text-center" aria-live="polite">{message}</p>

      <!-- OTP Input & Validation -->
      {#if otpSent}
          <div class="mb-4">
              <input 
                  type="text" 
                  bind:value={otp} 
                  placeholder="Enter OTP" 
                  class="border border-white/30 p-3 w-full rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#E63946]"
                  on:keydown={(e) => e.key === 'Enter' && validateOTP()}
              />
          </div>
          
          <button 
              on:click={validateOTP} 
              class="bg-[#1D1E21] text-white px-6 py-3 rounded-lg w-full transition-all transform hover:scale-105 hover:bg-[#333] shadow-lg"
              disabled={isLoading}
          >
              {isLoading ? "Validating..." : "Validate OTP"}
          </button>
      {/if}
  </div>
</div>

<style>
  /* Disable button when loading */
  button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
  }

  /* Remove outline when input is focused */
  input:focus {
      outline: none;
  }
</style>
