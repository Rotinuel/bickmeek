<script>
	import { page } from '$app/state';
	import { waLink, primaryWhatsApp } from '$lib/whatsapp.js';
	import WhatsAppIcon from './WhatsAppIcon.svelte';

	/** Link to the main WhatsApp line with a prefilled message. */
	let { message = '', label = 'Chat on WhatsApp', class: klass = 'btn btn-wa', number = null } = $props();
	const href = $derived(waLink(number ?? primaryWhatsApp(page.data.settings), message));
</script>

<a {href} target="_blank" rel="noopener" class={klass}>
	<WhatsAppIcon size={20} />
	<span>{label}</span>
</a>
