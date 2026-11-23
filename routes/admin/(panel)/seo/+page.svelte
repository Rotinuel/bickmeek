<script>
	import { enhance } from '$app/forms';
	import Notice from '$lib/components/admin/Notice.svelte';
	import MediaInput from '$lib/components/admin/MediaInput.svelte';

	let { data, form } = $props();
	let open = $state('home');
	let pages = $state(data.pages.map((p) => ({ ...p })));
	const len = (v, min, max) => {
		const n = (v || '').length;
		return n === 0 ? 'text-slate' : n < min || n > max ? 'text-warn' : 'text-ok';
	};
</script>

<svelte:head><title>SEO · BiceMeek admin</title></svelte:head>

<h1 class="headline text-3xl">SEO</h1>
<p class="mt-1 max-w-[72ch] text-slate">
	Control how each page appears in Google and when shared on WhatsApp or social media. Individual service pages are edited
	under <a href="/admin/services" class="underline">Services</a>. Mention “Minna” naturally — don’t repeat keywords.
</p>

<div class="mt-6"><Notice {form} /></div>

<form method="POST" action="?/default_og" enctype="multipart/form-data" class="a-card mb-6 space-y-4 p-6" use:enhance={() => async ({ update }) => update({ reset: false })}>
	<h2 class="text-lg font-bold">Default social sharing image</h2>
	<p class="field-hint">Used when a page has no image of its own. Best size: 1200 × 630 pixels.</p>
	<MediaInput name="og" label="Sharing image" current={data.defaultOgImage || '/og-default.jpg'} />
	<button class="btn btn-ink btn-sm">Save image</button>
</form>

<div class="space-y-3">
	{#each pages as p (p.key)}
		<details class="a-card" open={open === p.key} ontoggle={(e) => e.currentTarget.open && (open = p.key)}>
			<summary class="flex cursor-pointer items-center justify-between gap-4 p-5">
				<span>
					<span class="font-bold">{p.label}</span>
					<span class="ml-2 text-sm text-slate">{p.path}</span>
				</span>
				<span class="truncate text-sm text-slate">{p.title}</span>
			</summary>
			<form method="POST" action="?/page" enctype="multipart/form-data" class="space-y-4 border-t border-line p-5" use:enhance={() => async ({ update }) => update({ reset: false })}>
				<input type="hidden" name="page" value={p.key} />
				<div>
					<label class="field-label" for="{p.key}-title">Page title</label>
					<input id="{p.key}-title" name="title" bind:value={p.title} maxlength="80" class="input" />
					<p class="field-hint {len(p.title, 30, 60)}">{(p.title || '').length} characters — aim for 50–60.</p>
				</div>
				<div>
					<label class="field-label" for="{p.key}-desc">Meta description</label>
					<textarea id="{p.key}-desc" name="description" bind:value={p.description} rows="3" maxlength="200" class="input"></textarea>
					<p class="field-hint {len(p.description, 110, 160)}">{(p.description || '').length} characters — aim for 140–160.</p>
				</div>
				<div>
					<label class="field-label" for="{p.key}-kw">Keywords</label>
					<input id="{p.key}-kw" name="keywords" value={p.keywords ?? ''} maxlength="300" class="input" placeholder="comma separated" />
					<p class="field-hint">Google ignores this tag for ranking; it’s kept for other search tools and your own reference.</p>
				</div>
				<MediaInput name="og" label="Social sharing image for this page" current={p.ogImage ?? ''} />
				<div class="rounded-2xl bg-mist p-4">
					<p class="text-xs text-slate">Google preview</p>
					<p class="mt-1 truncate text-lg text-[#1a0dab]">{p.title}</p>
					<p class="text-sm text-[#006621]">{p.path}</p>
					<p class="line-clamp-2 text-sm text-slate">{p.description}</p>
				</div>
				<button class="btn btn-ink btn-sm">Save {p.label}</button>
			</form>
		</details>
	{/each}
</div>
