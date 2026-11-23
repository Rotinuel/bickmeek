<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import WhatsAppFloat from '$lib/components/WhatsAppFloat.svelte';

	let { data, children } = $props();
</script>

<Navbar settings={data.settings} />
<main id="main">
	{@render children()}
</main>
<Footer settings={data.settings} services={data.services} />
<WhatsAppFloat />
