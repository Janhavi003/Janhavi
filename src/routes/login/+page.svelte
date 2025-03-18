<script>
    import { goto } from '$app/navigation';
    import { onMount, tick } from 'svelte';
    import { browser } from '$app/environment';

    // User input variables
    let countryCode = ''; // Stores the country code entered by the user
    let phoneNumber = ''; // Stores the phone number entered by the user
    let otp = ''; // Stores the OTP entered by the user

    // UI state variables
    let otpSent = false; // Tracks if OTP has been sent successfully
    let isLoading = false; // Tracks loading state for API calls
    let message = ''; // Stores error or success messages for user feedback

    // Function to request OTP
    async function requestOTP() {
        message = "";
        
        // Validate user input
        if (!countryCode.trim()) {
            message = "❌ Please enter your country code.";
            return;
        }
        if (!phoneNumber.trim()) {
            message = "❌ Please enter a valid phone number.";
            return;
        }

        try {
            isLoading = true;
            await tick(); // Ensures UI updates before API call

            // API request to request OTP
            const response = await fetch('/api/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: { countryCode, number: phoneNumber.trim() }
                })
            });

            isLoading = false;
            await tick(); // Ensures UI updates

            // Check response status
            if (response.status === 204) {
                otpSent = true; // Set OTP sent flag to true
                message = "✅ OTP sent successfully!";
            } else {
                const data = response.bodyUsed ? await response.json() : {};
                message = data.error || "❌ Failed to send OTP.";
            }
        } catch (error) {
            isLoading = false;
            console.error("Error requesting OTP:", error);
            message = "❌ An error occurred while sending OTP.";
        }
    }

    // Function to validate OTP
    async function validateOTP() {
        message = "";
        
        // Ensure OTP is entered
        if (!otp.trim()) {
            message = "❌ Please enter the OTP.";
            return;
        }

        try {
            isLoading = true;
            await tick(); // UI update before API call

            // API request to validate OTP
            const response = await fetch('/api/validate-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: { countryCode, number: phoneNumber.trim() },
                    otp: { code: otp.trim() }
                })
            });

            isLoading = false;
            const data = response.bodyUsed ? await response.json() : {};

            // Handle response and redirect if successful
            if (response.ok && data.token) {
                if (browser) {
                    localStorage.setItem("authToken", data.token); // Store authentication token
                }
                message = "✅ OTP verified! Redirecting...";
                await tick();
                goto("/orders"); // Navigate to orders page
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

<!-- Beautiful Glassmorphic UI -->
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

<!-- Modern Glassmorphism & Animations -->
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
