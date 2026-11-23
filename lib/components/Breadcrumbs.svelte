<script>
	let { items = [] } = $props();
</script>

<nav aria-label="Breadcrumb" class="text-sm">
	<ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate">
		{#each items as item, i}
			<li class="flex items-center gap-2">
				{#if i < items.length - 1}
					<a href={item.path} class="hover:text-ink hover:underline">{item.name}</a>
					<span aria-hidden="true">/</span>
				{:else}
					<span aria-current="page" class="font-semibold text-ink">{item.name}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
