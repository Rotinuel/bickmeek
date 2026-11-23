<script>
	import { Star } from '@lucide/svelte';
	let { rating = 5, size = 18 } = $props();
</script>

<span class="inline-flex gap-0.5" role="img" aria-label="Rated {rating} out of 5">
	{#each [1, 2, 3, 4, 5] as i}
		<Star {size} class={i <= rating ? 'fill-sun text-sun-deep' : 'text-line'} aria-hidden="true" />
	{/each}
</span>
