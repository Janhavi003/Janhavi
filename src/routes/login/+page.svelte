<script>
    import { goto } from '$app/navigation';

    let countryCode = '';
    let phoneNumber = '';
    let otp = '';
    let otpSent = false;
    let isLoading = false;
    let message = '';

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
        <p class="mt-2 text-gray-300 text-center">{message}</p>

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
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    input:focus {
        outline: none;
    }
</style>
