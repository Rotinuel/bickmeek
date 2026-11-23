<script>
	/** Drag/keyboard comparison slider. Uses a native range input for accessibility. */
	let { before, after, alt = 'Cleaning result', label = '' } = $props();
	let pos = $state(50);
	const uid = $props.id();
	const id = `ba-${uid}`;
</script>

<figure class="w-full">
	<div class="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-mist select-none">
		<img src={after} alt="After: {alt}" class="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
		<div class="absolute inset-0" style="clip-path: inset(0 {100 - pos}% 0 0)">
			<img src={before} alt="Before: {alt}" class="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
		</div>
		<div class="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-sun" style="left: {pos}%">
			<span class="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-sun text-sm font-black text-ink shadow-lg">
				⇆
			</span>
		</div>
		<span class="pointer-events-none absolute top-4 left-4 rounded-full bg-ink px-3 py-1 text-xs font-bold text-paper">Before</span>
		<span class="pointer-events-none absolute top-4 right-4 rounded-full bg-sun px-3 py-1 text-xs font-bold text-ink">After</span>
		<label for={id} class="sr-only">Slide to compare before and after</label>
		<input
			{id}
			type="range"
			min="0"
			max="100"
			bind:value={pos}
			class="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
		/>
	</div>
	{#if label}<figcaption class="mt-3 text-sm text-slate">{label}</figcaption>{/if}
</figure>
