<script>
	// Roofline mark + wordmark drawn in SVG so it stays sharp. Swap /static/logo.svg for the
	// official artwork if preferred; this component is used in the header and footer.
	let { tone = 'dark', compact = false } = $props();
	const ink = $derived(tone === 'dark' ? '#000' : '#fff');
</script>

<span class="inline-flex items-center gap-2.5">
	<svg viewBox="0 0 48 48" class="h-10 w-10 shrink-0" aria-hidden="true">
		<rect width="48" height="48" rx="14" fill="#FFC20E" />
		<path d="M9 25 24 12l15 13" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M15 23v13h18V23" fill="none" stroke="#000" stroke-width="4" stroke-linejoin="round" />
		<path d="m34 8 1.3 3.2L38.5 12.5l-3.2 1.3L34 17l-1.3-3.2-3.2-1.3 3.2-1.3Z" fill="#000" />
		<rect x="21" y="27" width="6" height="9" rx="1" fill="#000" />
	</svg>
	{#if !compact}
		<span class="flex flex-col leading-none">
			<span class="text-[1.35rem] font-extrabold tracking-tight" style="font-stretch:118%;color:{ink}">BiceMeek</span>
			<span class="mt-1 text-[0.68rem] font-semibold tracking-[0.08em]" style="color:{tone === 'dark' ? '#4f545b' : '#d9dad6'}">Cleaning Services</span>
		</span>
	{/if}
</span>
