<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { ArrowLeft } from '@lucide/svelte';
	import Notice from '$lib/components/admin/Notice.svelte';
	import MediaInput from '$lib/components/admin/MediaInput.svelte';
	import ServiceIcon from '$lib/components/ServiceIcon.svelte';
	import { SERVICE_ICONS } from '$lib/constants.js';

	let { data, form } = $props();
	const s = $derived(data.service);
	let busy = $state(false);
	let icon = $state(data.service.icon);
	const created = $derived(page.url.searchParams.get('created') === '1' && !form);
</script>

<svelte:head><title>{data.isNew ? 'New service' : s.name} · BiceMeek admin</title></svelte:head>

<a href="/admin/services" class="inline-flex items-center gap-2 text-sm font-semibold hover:underline"><ArrowLeft size={16} /> All services</a>
<h1 class="headline mt-4 text-3xl">{data.isNew ? 'Add a service' : `Edit ${s.name}`}</h1>

<div class="mt-6">
	{#if created}<Notice form={{ saved: 'Service created.' }} />{/if}
	<Notice {form} />
</div>

<form
	method="POST"
	action="?/save"
	enctype="multipart/form-data"
	class="grid gap-6 xl:grid-cols-[1.5fr_1fr]"
	use:enhance={() => {
		busy = true;
		return async ({ update }) => {
			await update({ reset: false });
			busy = false;
		};
	}}
>
	<div class="space-y-6">
		<section class="a-card space-y-5 p-6">
			<h2 class="text-lg font-bold">Basics</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="name" class="field-label">Service name</label>
					<input id="name" name="name" value={s.name} required maxlength="100" class="input" />
				</div>
				<div>
					<label for="slug" class="field-label">Web address</label>
					<div class="flex items-center rounded-xl border-2 border-line focus-within:border-ink">
						<span class="pl-4 text-sm text-slate">/services/</span>
						<input id="slug" name="slug" value={s.slug} maxlength="80" class="w-full rounded-xl px-1 py-3 outline-none" placeholder="auto from name" />
					</div>
					<p class="field-hint">Changing this changes the page link. Avoid it once the page is indexed on Google.</p>
				</div>
			</div>
			<div>
				<label for="shortDescription" class="field-label">Short description</label>
				<textarea id="shortDescription" name="shortDescription" rows="2" maxlength="240" class="input">{s.shortDescription}</textarea>
				<p class="field-hint">Shown on service lists and cards. Up to 240 characters.</p>
			</div>
			<div>
				<label for="description" class="field-label">Full description</label>
				<textarea id="description" name="description" rows="6" maxlength="4000" class="input">{s.description}</textarea>
				<p class="field-hint">Leave a blank line between paragraphs.</p>
			</div>
			<div>
				<label for="priceInfo" class="field-label">Pricing note</label>
				<input id="priceInfo" name="priceInfo" value={s.priceInfo} maxlength="160" class="input" placeholder="e.g. From ₦25,000 — or: Priced by home size, request a quote" />
			</div>
		</section>

		<section class="a-card space-y-5 p-6">
			<h2 class="text-lg font-bold">Details <span class="text-sm font-normal text-slate">(one item per line)</span></h2>
			<div>
				<label for="covers" class="field-label">What the service covers</label>
				<textarea id="covers" name="covers" rows="7" class="input">{s.covers.join('\n')}</textarea>
			</div>
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="idealFor" class="field-label">Who it’s for</label>
					<textarea id="idealFor" name="idealFor" rows="5" class="input">{s.idealFor.join('\n')}</textarea>
				</div>
				<div>
					<label for="benefits" class="field-label">Benefits</label>
					<textarea id="benefits" name="benefits" rows="5" class="input">{s.benefits.join('\n')}</textarea>
				</div>
			</div>
		</section>

		<section class="a-card space-y-5 p-6">
			<h2 class="text-lg font-bold">Search engine listing</h2>
			<div>
				<label for="seoTitle" class="field-label">Page title</label>
				<input id="seoTitle" name="seoTitle" value={s.seoTitle} maxlength="80" class="input" placeholder="{s.name || 'Service'} in Minna | BiceMeek Cleaning Services" />
				<p class="field-hint">Aim for 50–60 characters. Include “Minna”.</p>
			</div>
			<div>
				<label for="seoDescription" class="field-label">Meta description</label>
				<textarea id="seoDescription" name="seoDescription" rows="3" maxlength="200" class="input">{s.seoDescription}</textarea>
				<p class="field-hint">Aim for 140–160 characters.</p>
			</div>
			<div>
				<label for="seoKeywords" class="field-label">Keywords</label>
				<input id="seoKeywords" name="seoKeywords" value={s.seoKeywords ?? ''} maxlength="300" class="input" placeholder="comma separated" />
			</div>
		</section>
	</div>

	<div class="space-y-6">
		<section class="a-card space-y-5 p-6">
			<h2 class="text-lg font-bold">Display</h2>
			<label class="flex items-center gap-3 font-semibold">
				<input type="checkbox" name="enabled" checked={s.enabled} class="h-5 w-5 accent-ink" /> Show on website
			</label>
			<div>
				<label for="order" class="field-label">Order</label>
				<input id="order" name="order" type="number" min="0" max="999" value={s.order} class="input" />
				<p class="field-hint">Lower numbers appear first.</p>
			</div>
			<fieldset>
				<legend class="field-label">Icon</legend>
				<div class="grid grid-cols-6 gap-2">
					{#each SERVICE_ICONS as name}
						<label class="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-line has-[:checked]:border-ink has-[:checked]:bg-sun" title={name}>
							<input type="radio" name="icon" value={name} bind:group={icon} class="sr-only" />
							<ServiceIcon {name} size={22} />
							<span class="sr-only">{name}</span>
						</label>
					{/each}
				</div>
			</fieldset>
			<MediaInput name="image" label="Service photo" current={s.image} hint="JPG, PNG or WebP up to 4 MB. Landscape photos work best." />
			<div>
				<label for="imageAlt" class="field-label">Photo description (alt text)</label>
				<input id="imageAlt" name="imageAlt" value={s.imageAlt ?? ''} maxlength="200" class="input" placeholder="e.g. Cleaner mopping a tiled living room in Minna" />
			</div>
		</section>
		<button class="btn btn-ink w-full" disabled={busy}>{busy ? 'Saving…' : data.isNew ? 'Create service' : 'Save changes'}</button>
	</div>
</form>
