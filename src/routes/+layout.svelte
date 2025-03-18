<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import '../app.css'; 

    onMount(() => {
        goto('/'); 
    });
</script>

<slot />