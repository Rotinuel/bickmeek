<script>
	import { page } from '$app/state';
	import { waLink, formatPhone } from '$lib/whatsapp.js';
	import WhatsAppIcon from './WhatsAppIcon.svelte';

	/** Lists every WhatsApp line so the customer can pick one. */
	let { message = '', tone = 'light' } = $props();
	const lines = $derived(page.data.settings?.whatsapp ?? []);
</script>

<ul class="grid gap-2 sm:grid-cols-2">
	{#each lines as line}
		<li>
			<a
				href={waLink(line.number, message)}
				target="_blank"
				rel="noopener"
				class="flex items-center gap-3 rounded-2xl border-2 px-4 py-3 transition-colors {tone === 'dark'
					? 'border-paper/25 hover:border-sun hover:bg-paper/5'
					: 'border-line hover:border-ink'}"
			>
				<span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1f8f4e] text-paper">
					<WhatsAppIcon size={20} />
				</span>
				<span class="leading-tight">
					<span class="block font-bold">{line.label || 'WhatsApp'}</span>
					<span class="text-sm {tone === 'dark' ? 'text-paper/70' : 'text-slate'}">{formatPhone(line.number)}</span>
				</span>
			</a>
		</li>
	{/each}
</ul>
