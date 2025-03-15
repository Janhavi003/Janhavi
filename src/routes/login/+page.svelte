<script>
    import { goto } from '$app/navigation';

    let countryCode = ''; 
    let phoneNumber = '';
    let otp = '';
    let otpSent = false; 
    let isLoading = false;
    let message = '';

    // Request OTP from API
    async function requestOTP() {
        message = "";
        if (!phoneNumber.trim()) {
            message = "❌ Please enter a valid phone number.";
            return;
        }

        try {
            isLoading = true;
            const response = await fetch('/api/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: { countryCode, number: phoneNumber.trim() }
                })
            });

            isLoading = false;
            if (response.status === 204) {
                otpSent = true;
                message = "✅ OTP sent successfully!";
            } else {
                const data = await response.json();
                message = data.error || "❌ Failed to send OTP.";
            }
        } catch (error) {
            isLoading = false;
            console.error("Error requesting OTP:", error);
            message = "❌ An error occurred while sending OTP.";
        }
    }

    // Validate OTP
    async function validateOTP() {
        message = "";
        if (!otp.trim()) {
            message = "❌ Please enter the OTP.";
            return;
        }

        try {
            isLoading = true;
            const response = await fetch('/api/validate-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: { countryCode, number: phoneNumber.trim() },
                    otp: { code: otp.trim() }
                })
            });

            isLoading = false;
            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem("authToken", data.token);  
                message = "✅ OTP verified! Redirecting...";
                goto("/orders");  
            } else {
                message = data.error || "❌ Invalid OTP. Try again.";
            }
        } catch (error) {
            isLoading = false;
            console.error("Error validating OTP:", error);
            message = "❌ An error occurred while validating OTP.";
        }
    }
</script>

<!-- UI Design with TailwindCSS -->
<div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 py-6">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full sm:w-96 md:w-80 lg:w-96">
        <h1 class="text-3xl font-semibold text-center text-blue-600 mb-6">Login</h1>

        <!-- Phone Number Input -->
        <div class="flex gap-2 mb-4">
            <input 
                type="text" 
                bind:value={countryCode} 
                placeholder="Code" 
                class="border p-3 w-1/3 text-center rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input 
                type="text" 
                bind:value={phoneNumber} 
                placeholder="Phone Number" 
                class="border p-3 w-2/3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <!-- Request OTP Button -->
        <button 
            on:click={requestOTP} 
            class="bg-blue-600 text-white px-6 py-3 rounded-lg w-full mb-4 hover:bg-blue-700 transition-all"
            disabled={isLoading}
        >
            {isLoading ? "Requesting..." : "Request OTP"}
        </button>

        <p class="mt-2 text-gray-700">{message}</p>

        <!-- OTP Input & Validation -->
        {#if otpSent}
            <div class="mb-4">
                <input 
                    type="text" 
                    bind:value={otp} 
                    placeholder="Enter OTP" 
                    class="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                    on:keydown={(e) => e.key === 'Enter' && validateOTP()}
                />
            </div>
            
            <button 
                on:click={validateOTP} 
                class="bg-green-600 text-white px-6 py-3 rounded-lg w-full hover:bg-green-700 transition-all"
                disabled={isLoading}
            >
                {isLoading ? "Validating..." : "Validate OTP"}
            </button>
        {/if}
    </div>
</div>

<style>
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    input:focus {
        outline: none;
    }
</style>
