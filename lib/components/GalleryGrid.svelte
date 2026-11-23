<script>
	import { ChevronLeft, ChevronRight, Play, X } from '@lucide/svelte';
	import { GALLERY_CATEGORIES, categoryLabel } from '$lib/constants.js';
	import { videoEmbed } from '$lib/format.js';
	import BeforeAfter from './BeforeAfter.svelte';

	let { items = [], filters = true } = $props();

	let category = $state('all');
	let current = $state(-1);
	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();

	const usedCategories = $derived(GALLERY_CATEGORIES.filter((c) => items.some((i) => i.category === c.value)));
	const visible = $derived(category === 'all' ? items : items.filter((i) => i.category === category));
	const active = $derived(visible[current]);

	function openAt(i) {
		current = i;
		dialog?.showModal();
	}
	function close() {
		dialog?.close();
	}
	function step(d) {
		current = (current + d + visible.length) % visible.length;
	}
	function onKey(e) {
		if (e.key === 'ArrowRight') step(1);
		if (e.key === 'ArrowLeft') step(-1);
	}
	const thumb = (item) => (item.mediaType === 'before_after' ? item.afterUrl : item.url);
</script>

{#if filters && usedCategories.length > 1}
	<div class="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
		<button
			type="button"
			class="rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors {category === 'all'
				? 'border-ink bg-ink text-paper'
				: 'border-line hover:border-ink'}"
			aria-pressed={category === 'all'}
			onclick={() => (category = 'all')}>All work</button
		>
		{#each usedCategories as c}
			<button
				type="button"
				class="rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors {category === c.value
					? 'border-ink bg-ink text-paper'
					: 'border-line hover:border-ink'}"
				aria-pressed={category === c.value}
				onclick={() => (category = c.value)}>{c.label}</button
			>
		{/each}
	</div>
{/if}

<ul class="columns-1 gap-5 sm:columns-2 lg:columns-3">
	{#each visible as item, i (item._id)}
		<li class="mb-5 break-inside-avoid">
			{#if item.mediaType === 'before_after'}
				<BeforeAfter before={item.beforeUrl} after={item.afterUrl} alt={item.alt || item.title} label={item.title} />
			{:else}
				<button
					type="button"
					class="group relative block w-full overflow-hidden rounded-[1.75rem] bg-mist text-left"
					onclick={() => openAt(i)}
					aria-label="Open {item.title || categoryLabel(item.category)}"
				>
					{#if item.mediaType === 'video'}
						{#if videoEmbed(item.url)}
							<div class="grid aspect-video place-items-center bg-ink text-paper">
								<span class="font-semibold">{item.title || 'Watch video'}</span>
							</div>
						{:else}
							<video src="{item.url}#t=0.5" preload="metadata" muted playsinline class="block w-full"></video>
						{/if}
						<span class="absolute inset-0 grid place-items-center">
							<span class="grid h-16 w-16 place-items-center rounded-full bg-sun text-ink shadow-lg transition-transform group-hover:scale-110">
								<Play size={28} class="ml-1 fill-ink" aria-hidden="true" />
							</span>
						</span>
					{:else}
						<img
							src={thumb(item)}
							alt={item.alt || item.title || categoryLabel(item.category)}
							loading="lazy"
							decoding="async"
							class="block w-full transition-transform duration-500 group-hover:scale-[1.03]"
						/>
					{/if}
					{#if item.title}
						<span class="absolute inset-x-3 bottom-3 rounded-2xl bg-paper/95 px-4 py-2.5 text-sm font-semibold">
							{item.title}
							<span class="block text-xs font-normal text-slate">{categoryLabel(item.category)}</span>
						</span>
					{/if}
				</button>
			{/if}
		</li>
	{/each}
</ul>

<dialog
	bind:this={dialog}
	class="m-auto h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink/90"
	onclose={() => (current = -1)}
	onkeydown={onKey}
	aria-label="Media viewer"
>
	{#if active}
		<div class="flex h-full flex-col p-4 sm:p-8">
			<div class="flex justify-end">
				<button type="button" onclick={close} class="grid h-12 w-12 place-items-center rounded-full bg-paper text-ink" aria-label="Close viewer">
					<X size={22} />
				</button>
			</div>
			<div class="relative flex min-h-0 flex-1 items-center justify-center gap-3 py-4">
				{#if visible.length > 1}
					<button type="button" onclick={() => step(-1)} class="hidden h-12 w-12 shrink-0 place-items-center rounded-full bg-paper/15 text-paper hover:bg-sun hover:text-ink sm:grid" aria-label="Previous">
						<ChevronLeft size={24} />
					</button>
				{/if}
				<div class="flex max-h-full min-h-0 max-w-5xl flex-1 items-center justify-center">
					{#if active.mediaType === 'video'}
						{#if videoEmbed(active.url)}
							<iframe
								src={videoEmbed(active.url)}
								title={active.title || 'Video'}
								class="aspect-video w-full rounded-2xl"
								allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
								allowfullscreen
							></iframe>
						{:else}
							<!-- svelte-ignore a11y_media_has_caption -->
							<video src={active.url} controls autoplay playsinline class="max-h-[75vh] w-full rounded-2xl bg-ink"></video>
						{/if}
					{:else}
						<img src={active.url} alt={active.alt || active.title || ''} class="max-h-[75vh] w-auto rounded-2xl object-contain" />
					{/if}
				</div>
				{#if visible.length > 1}
					<button type="button" onclick={() => step(1)} class="hidden h-12 w-12 shrink-0 place-items-center rounded-full bg-paper/15 text-paper hover:bg-sun hover:text-ink sm:grid" aria-label="Next">
						<ChevronRight size={24} />
					</button>
				{/if}
			</div>
			<div class="mx-auto w-full max-w-3xl text-center text-paper">
				{#if active.title}<p class="text-lg font-bold">{active.title}</p>{/if}
				{#if active.caption}<p class="mt-1 text-paper/75">{active.caption}</p>{/if}
				{#if visible.length > 1}
					<div class="mt-4 flex justify-center gap-3 sm:hidden">
						<button type="button" onclick={() => step(-1)} class="btn btn-ghost-light btn-sm">Previous</button>
						<button type="button" onclick={() => step(1)} class="btn btn-ghost-light btn-sm">Next</button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</dialog>
