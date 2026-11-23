<script>
	import { page } from '$app/state';
	import { X } from '@lucide/svelte';
	import { waLink, formatPhone, waMessage } from '$lib/whatsapp.js';
	import WhatsAppIcon from './WhatsAppIcon.svelte';

	let open = $state(false);
	const settings = $derived(page.data.settings ?? {});
	const lines = $derived(settings.whatsapp ?? []);
	// Pages can set a context message (e.g. the service being viewed) through page data.
	const message = $derived(page.data.waMessage || waMessage.general(settings.businessName));

	function onKey(e) {
		if (e.key === 'Escape') open = false;
	}
</script>

<svelte:window onkeydown={onKey} />

<div class="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
	{#if open}
		<div
			id="wa-panel"
			role="dialog"
			aria-label="Choose a WhatsApp line"
			class="w-[min(20rem,calc(100vw-2rem))] rounded-3xl bg-ink p-5 text-paper shadow-2xl"
		>
			<p class="text-lg font-bold">Chat with us on WhatsApp</p>
			<p class="mt-1 text-sm text-paper/70">Pick a line. We’ll open WhatsApp with a message ready to send.</p>
			<ul class="mt-4 flex flex-col gap-2">
				{#each lines as line}
					<li>
						<a
							href={waLink(line.number, message)}
							target="_blank"
							rel="noopener"
							class="flex items-center justify-between rounded-2xl bg-paper/8 px-4 py-3 transition-colors hover:bg-sun hover:text-ink"
						>
							<span class="font-semibold">{line.label || 'WhatsApp'}</span>
							<span class="text-sm opacity-80">{formatPhone(line.number)}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<button
		type="button"
		class="flex h-15 w-15 items-center justify-center rounded-full bg-[#1f8f4e] text-paper shadow-xl ring-4 ring-paper transition-transform hover:scale-105"
		aria-expanded={open}
		aria-controls="wa-panel"
		aria-label={open ? 'Close WhatsApp options' : 'Chat with us on WhatsApp'}
		onclick={() => (open = !open)}
	>
		{#if open}<X size={26} />{:else}<WhatsAppIcon size={30} />{/if}
	</button>
</div>
