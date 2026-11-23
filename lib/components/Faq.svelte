<script>
	import { Plus } from '@lucide/svelte';
	let { faqs = [], tone = 'light' } = $props();
</script>

<div class="divide-y {tone === 'dark' ? 'divide-paper/15 border-y border-paper/15' : 'divide-line border-y border-line'}">
	{#each faqs as f}
		<details class="group">
			<summary
				class="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg font-bold [&::-webkit-details-marker]:hidden"
			>
				<span>{f.q}</span>
				<span
					class="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform duration-300 group-open:rotate-45 {tone ===
					'dark'
						? 'bg-paper/10'
						: 'bg-mist'}"
				>
					<Plus size={18} aria-hidden="true" />
				</span>
			</summary>
			<p class="max-w-[62ch] pb-6 {tone === 'dark' ? 'text-paper/75' : 'text-slate'}">{f.a}</p>
		</details>
	{/each}
</div>
