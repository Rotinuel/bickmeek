<script>
	import { enhance } from '$app/forms';
	import Notice from '$lib/components/admin/Notice.svelte';

	let { data, form } = $props();
</script>

<svelte:head><title>Cleaning plans · BiceMeek admin</title></svelte:head>

<h1 class="headline text-3xl">Cleaning plans</h1>
<p class="mt-1 max-w-[70ch] text-slate">
	These appear on the homepage, the cleaning plans page and the subscription landing page. Leave the price empty to show
	“Custom quote”. Only one plan can be highlighted.
</p>

<div class="mt-6"><Notice {form} /></div>

<div class="grid gap-6 2xl:grid-cols-3">
	{#each data.plans as p (p.key)}
		<form method="POST" action="?/save" class="a-card space-y-4 p-6 {p.highlighted ? 'ring-4 ring-sun' : ''}" use:enhance={() => async ({ update }) => update({ reset: false })}>
			<input type="hidden" name="key" value={p.key} />
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold capitalize">{p.key} plan</h2>
				<label class="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="enabled" checked={p.enabled} class="h-4 w-4 accent-ink" /> Visible</label>
			</div>
			<div>
				<label class="field-label" for="{p.key}-name">Name</label>
				<input id="{p.key}-name" name="name" value={p.name} maxlength="80" class="input" required />
			</div>
			<div>
				<label class="field-label" for="{p.key}-tagline">Tagline</label>
				<input id="{p.key}-tagline" name="tagline" value={p.tagline ?? ''} maxlength="160" class="input" />
			</div>
			<div>
				<label class="field-label" for="{p.key}-description">Description</label>
				<textarea id="{p.key}-description" name="description" rows="4" maxlength="1200" class="input">{p.description ?? ''}</textarea>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label class="field-label" for="{p.key}-price">Price (₦)</label>
					<input id="{p.key}-price" name="price" inputmode="numeric" value={p.price ?? ''} placeholder="Custom quote" class="input" />
				</div>
				<div>
					<label class="field-label" for="{p.key}-unit">Price unit</label>
					<input id="{p.key}-unit" name="priceUnit" value={p.priceUnit ?? ''} maxlength="40" placeholder="per month" class="input" />
				</div>
			</div>
			<div>
				<label class="field-label" for="{p.key}-note">Price note</label>
				<input id="{p.key}-note" name="priceNote" value={p.priceNote ?? ''} maxlength="160" class="input" />
			</div>
			<div>
				<label class="field-label" for="{p.key}-inc">What’s included <span class="font-normal text-slate">(one per line)</span></label>
				<textarea id="{p.key}-inc" name="inclusions" rows="7" class="input">{(p.inclusions ?? []).join('\n')}</textarea>
			</div>
			<div>
				<label class="field-label" for="{p.key}-best">Best for</label>
				<input id="{p.key}-best" name="bestFor" value={p.bestFor ?? ''} maxlength="240" class="input" />
			</div>
			<div class="flex items-center justify-between gap-4">
				<label class="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="highlighted" checked={p.highlighted} class="h-4 w-4 accent-ink" /> Highlight this plan</label>
				<label class="flex items-center gap-2 text-sm">Order <input name="order" type="number" min="0" max="99" value={p.order} class="input !w-20 !py-1.5" /></label>
			</div>
			<button class="btn btn-ink w-full">Save {p.key} plan</button>
		</form>
	{/each}
</div>
