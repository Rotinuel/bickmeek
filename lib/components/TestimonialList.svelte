<script>
	import Stars from './Stars.svelte';
	let { items = [], columns = 3 } = $props();
</script>

<ul class="grid gap-5 {columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'}">
	{#each items as t}
		<li class="flex flex-col rounded-[1.75rem] bg-mist p-7">
			<Stars rating={t.rating} />
			<blockquote class="mt-4 flex-1 text-lg leading-relaxed">“{t.text}”</blockquote>
			<footer class="mt-6">
				<p class="font-bold">{t.name}</p>
				<p class="text-sm text-slate">{[t.service, t.location].filter(Boolean).join(', ')}</p>
			</footer>
		</li>
	{/each}
</ul>
