<script>
	import { ArrowUpRight } from '@lucide/svelte';
	import ServiceIcon from './ServiceIcon.svelte';

	/** Services as large rows — a list you scan, not a grid of identical cards. */
	let { services = [], tone = 'light' } = $props();
	const dark = $derived(tone === 'dark');
</script>

<ul class="border-t-2 {dark ? 'border-paper/20' : 'border-ink'}">
	{#each services as s}
		<li class="border-b-2 {dark ? 'border-paper/20' : 'border-line'}">
			<a
				href="/services/{s.slug}"
				class="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 sm:gap-8 sm:py-8"
			>
				<span
					class="grid h-14 w-14 place-items-center rounded-2xl transition-colors sm:h-16 sm:w-16 {dark
						? 'bg-paper/10 text-sun group-hover:bg-sun group-hover:text-ink'
						: 'bg-mist group-hover:bg-sun'}"
				>
					<ServiceIcon name={s.icon} size={28} />
				</span>
				<span class="min-w-0">
					<span class="headline block text-2xl sm:text-[2rem]">{s.name}</span>
					{#if s.shortDescription}
						<span class="mt-1.5 block max-w-[60ch] {dark ? 'text-paper/70' : 'text-slate'}">{s.shortDescription}</span>
					{/if}
				</span>
				<span
					class="grid h-12 w-12 place-items-center rounded-full border-2 transition-colors {dark
						? 'border-paper/30 group-hover:border-sun group-hover:bg-sun group-hover:text-ink'
						: 'border-ink group-hover:bg-ink group-hover:text-paper'}"
				>
					<ArrowUpRight size={22} aria-hidden="true" />
					<span class="sr-only">View {s.name}</span>
				</span>
			</a>
		</li>
	{/each}
</ul>
