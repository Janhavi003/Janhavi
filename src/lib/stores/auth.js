// src/lib/stores/auth.js
import { writable } from 'svelte/store';

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') || null : null;

export const authStore = writable({
  countryCode: '',
  phoneNumber: '',
  otp: '',
  token: storedToken
});

// Function to set authentication data
export function setAuthData(data) {
  authStore.update((state) => {
    const newState = { ...state, ...data };
    if (newState.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', newState.token);
      }
    }
    return newState;
  });
}

// Reset authentication data
export function resetAuth() {
  authStore.set({ countryCode: '', phoneNumber: '', otp: '', token: null });
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}
