<script>
	import { enhance } from '$app/forms';
	import { Eye, EyeOff, Trash2 } from '@lucide/svelte';
	import Notice from '$lib/components/admin/Notice.svelte';
	import Stars from '$lib/components/Stars.svelte';

	let { data, form } = $props();
</script>

<svelte:head><title>Testimonials · BiceMeek admin</title></svelte:head>

<h1 class="headline text-3xl">Testimonials</h1>
<p class="mt-1 max-w-[70ch] text-slate">
	Only publish genuine feedback, with the customer’s permission. Entries marked “Demo” are layout samples and can’t be
	published until you replace them.
</p>

<div class="mt-6"><Notice {form} /></div>

<div class="grid gap-6 2xl:grid-cols-[26rem_1fr]">
	<form method="POST" action="?/create" class="a-card h-fit space-y-4 p-6" use:enhance>
		<h2 class="text-lg font-bold">Add a testimonial</h2>
		<div>
			<label for="t-name" class="field-label">Customer name</label>
			<input id="t-name" name="name" maxlength="100" required class="input" placeholder="e.g. Mrs Aisha B." />
			<p class="field-hint">First name and initial is fine.</p>
		</div>
		<div class="grid grid-cols-2 gap-3">
			<div>
				<label for="t-loc" class="field-label">Location</label>
				<input id="t-loc" name="location" maxlength="100" class="input" placeholder="e.g. Tunga, Minna" />
			</div>
			<div>
				<label for="t-svc" class="field-label">Service</label>
				<input id="t-svc" name="service" maxlength="100" class="input" placeholder="e.g. Weekly cleaning" />
			</div>
		</div>
		<div class="grid grid-cols-2 gap-3">
			<div>
				<label for="t-rating" class="field-label">Rating</label>
				<select id="t-rating" name="rating" class="input">{#each [5, 4, 3, 2, 1] as r}<option value={r}>{r} star{r > 1 ? 's' : ''}</option>{/each}</select>
			</div>
			<div>
				<label for="t-order" class="field-label">Order</label>
				<input id="t-order" name="order" type="number" min="0" value="0" class="input" />
			</div>
		</div>
		<div>
			<label for="t-text" class="field-label">What they said</label>
			<textarea id="t-text" name="text" rows="5" maxlength="1200" required class="input"></textarea>
		</div>
		<label class="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="published" class="h-4 w-4 accent-ink" /> Publish now</label>
		<button class="btn btn-ink w-full">Save testimonial</button>
	</form>

	<ul class="space-y-4">
		{#each data.items as t (t._id)}
			<li class="a-card p-5 {t.published ? '' : 'bg-paper/70'}">
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div>
						<p class="font-bold">
							{t.name}
							{#if t.isDemo}<span class="ml-2 rounded-full bg-sun px-2 py-0.5 text-xs">Demo</span>{/if}
							<span class="ml-2 rounded-full px-2 py-0.5 text-xs {t.published ? 'bg-[#e3f4ec] text-ok' : 'bg-mist text-slate'}">{t.published ? 'Published' : 'Draft'}</span>
						</p>
						<p class="text-sm text-slate">{[t.service, t.location].filter(Boolean).join(', ')}</p>
					</div>
					<Stars rating={t.rating} size={16} />
				</div>
				<p class="mt-3">“{t.text}”</p>
				<details class="mt-4">
					<summary class="cursor-pointer text-sm font-semibold underline">Edit</summary>
					<form method="POST" action="?/update" class="mt-3 grid gap-3 sm:grid-cols-2" use:enhance={() => async ({ update }) => update({ reset: false })}>
						<input type="hidden" name="id" value={t._id} />
						<input name="name" value={t.name} maxlength="100" class="input !py-2" aria-label="Name" />
						<input name="location" value={t.location ?? ''} maxlength="100" class="input !py-2" aria-label="Location" placeholder="Location" />
						<input name="service" value={t.service ?? ''} maxlength="100" class="input !py-2" aria-label="Service" placeholder="Service" />
						<div class="grid grid-cols-2 gap-2">
							<select name="rating" class="input !py-2" aria-label="Rating">{#each [5, 4, 3, 2, 1] as r}<option value={r} selected={t.rating === r}>{r}★</option>{/each}</select>
							<input name="order" type="number" min="0" value={t.order} class="input !py-2" aria-label="Order" />
						</div>
						<textarea name="text" rows="4" maxlength="1200" class="input sm:col-span-2" aria-label="Review text">{t.text}</textarea>
						<div class="flex flex-wrap gap-4 text-sm sm:col-span-2">
							<label class="flex items-center gap-2"><input type="checkbox" name="published" checked={t.published} class="accent-ink" /> Published</label>
							<label class="flex items-center gap-2"><input type="checkbox" name="isDemo" checked={t.isDemo} class="accent-ink" /> Demo content</label>
						</div>
						<button class="btn btn-ink btn-sm w-fit">Save</button>
					</form>
				</details>
				<div class="mt-3 flex gap-2">
					<form method="POST" action="?/toggle" use:enhance>
						<input type="hidden" name="id" value={t._id} />
						<button class="btn btn-ghost btn-sm">{#if t.published}<EyeOff size={15} aria-hidden="true" /> Unpublish{:else}<Eye size={15} aria-hidden="true" /> Publish{/if}</button>
					</form>
					<form method="POST" action="?/delete" use:enhance={({ cancel }) => { if (!confirm('Delete this testimonial?')) cancel(); }}>
						<input type="hidden" name="id" value={t._id} />
						<button class="btn btn-sm border-2 border-line text-bad hover:border-bad" aria-label="Delete"><Trash2 size={15} /></button>
					</form>
				</div>
			</li>
		{:else}
			<li class="a-card p-8 text-slate">No testimonials yet.</li>
		{/each}
	</ul>
</div>
