<script>
	import { enhance } from '$app/forms';
	import { Eye, EyeOff, Trash2, Star, LoaderCircle } from '@lucide/svelte';
	import Notice from '$lib/components/admin/Notice.svelte';
	import MediaInput from '$lib/components/admin/MediaInput.svelte';
	import { GALLERY_CATEGORIES, categoryLabel } from '$lib/constants.js';
	import { videoEmbed } from '$lib/format.js';

	let { data, form } = $props();
	let mediaType = $state('image');
	let busy = $state(false);
	let progress = $state('');

	/** With Vercel Blob, large videos go straight from the browser to storage first. */
	async function directVideoUpload(formData) {
		const file = formData.get('mediaFile');
		if (data.driver !== 'blob' || mediaType !== 'video' || !file || !file.size) return;
		progress = 'Uploading video…';
		const { upload } = await import('@vercel/blob/client');
		const blob = await upload(`bicemeek/${file.name}`, file, {
			access: 'public',
			handleUploadUrl: '/admin/api/blob-upload',
			onUploadProgress: (e) => (progress = `Uploading video… ${Math.round(e.percentage)}%`)
		});
		// enhance() already built the FormData, so swap the file for the uploaded URL there.
		formData.set('mediaUrl', blob.url);
		formData.delete('mediaFile');
		progress = '';
	}
</script>

<svelte:head><title>Gallery · BiceMeek admin</title></svelte:head>

<h1 class="headline text-3xl">Gallery</h1>
<p class="mt-1 max-w-[70ch] text-slate">
	Photos, videos and before-and-after pairs for the gallery page, homepage and landing page. Use real photos from BiceMeek
	jobs, with the customer’s permission.
</p>

<div class="mt-6"><Notice {form} /></div>

<div class="grid gap-6 2xl:grid-cols-[28rem_1fr]">
	<form
		method="POST"
		action="?/create"
		enctype="multipart/form-data"
		class="a-card h-fit space-y-4 p-6"
		use:enhance={async ({ formData, cancel }) => {
			busy = true;
			try {
				await directVideoUpload(formData);
			} catch (e) {
				busy = false;
				progress = '';
				alert(`Video upload failed: ${e.message}`);
				cancel();
				return;
			}
			return async ({ update }) => {
				await update();
				busy = false;
				mediaType = 'image';
			};
		}}
	>
		<h2 class="text-lg font-bold">Add to gallery</h2>
		<fieldset>
			<legend class="field-label">What are you adding?</legend>
			<div class="grid grid-cols-3 gap-2">
				{#each [['image', 'Photo'], ['video', 'Video'], ['before_after', 'Before & after']] as [v, l]}
					<label class="cursor-pointer rounded-xl border-2 border-line px-2 py-2.5 text-center text-sm font-bold has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper">
						<input type="radio" name="mediaType" value={v} bind:group={mediaType} class="sr-only" />{l}
					</label>
				{/each}
			</div>
		</fieldset>

		{#if mediaType === 'before_after'}
			<MediaInput name="before" label="Before photo" />
			<MediaInput name="after" label="After photo" />
			<p class="text-xs text-slate">Take both photos from the same spot and angle for the best comparison.</p>
		{:else if mediaType === 'video'}
			<MediaInput
				name="media"
				label="Video"
				kind="video"
				hint={data.driver === 'blob'
					? 'MP4 or WebM. Large files upload directly to storage.'
					: 'MP4 or WebM up to 50 MB (about 4 MB when hosted on Vercel with database storage). You can also paste a YouTube link.'}
			/>
		{:else}
			<MediaInput name="media" label="Photo" hint="JPG, PNG or WebP up to 4 MB." />
		{/if}

		<div>
			<label for="g-title" class="field-label">Title</label>
			<input id="g-title" name="title" maxlength="140" class="input" placeholder="e.g. 3-bedroom deep clean, Bosso" />
		</div>
		<div>
			<label for="g-caption" class="field-label">Caption</label>
			<textarea id="g-caption" name="caption" rows="2" maxlength="600" class="input"></textarea>
		</div>
		<div>
			<label for="g-alt" class="field-label">Image description (alt text)</label>
			<input id="g-alt" name="alt" maxlength="200" class="input" placeholder="Describe what the photo shows" />
		</div>
		<div class="grid grid-cols-[1fr_6rem] gap-3">
			<div>
				<label for="g-cat" class="field-label">Category</label>
				<select id="g-cat" name="category" class="input">
					{#each GALLERY_CATEGORIES as c}<option value={c.value}>{c.label}</option>{/each}
				</select>
			</div>
			<div>
				<label for="g-order" class="field-label">Order</label>
				<input id="g-order" name="order" type="number" min="0" value="0" class="input" />
			</div>
		</div>
		<div class="flex gap-5">
			<label class="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="published" checked class="h-4 w-4 accent-ink" /> Publish now</label>
			<label class="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="featured" class="h-4 w-4 accent-ink" /> Feature on homepage</label>
		</div>
		<button class="btn btn-ink w-full" disabled={busy}>
			{#if busy}<LoaderCircle size={18} class="animate-spin" aria-hidden="true" /> {progress || 'Uploading…'}{:else}Add to gallery{/if}
		</button>
	</form>

	<section>
		{#if data.items.length}
			<ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#each data.items as item (item._id)}
					<li class="a-card overflow-hidden {item.published ? '' : 'opacity-70'}">
						<div class="relative aspect-[4/3] bg-mist">
							{#if item.mediaType === 'before_after'}
								<div class="grid h-full grid-cols-2">
									<img src={item.beforeUrl} alt="" class="h-full w-full object-cover" />
									<img src={item.afterUrl} alt="" class="h-full w-full object-cover" />
								</div>
							{:else if item.mediaType === 'video'}
								{#if videoEmbed(item.url)}
									<div class="grid h-full place-items-center bg-ink p-4 text-center text-sm text-paper">Embedded video<br />{item.url}</div>
								{:else}
									<video src={item.url} class="h-full w-full object-cover" muted preload="metadata"></video>
								{/if}
							{:else}
								<img src={item.url} alt="" class="h-full w-full object-cover" loading="lazy" />
							{/if}
							<span class="absolute top-2 left-2 rounded-full bg-paper px-2 py-0.5 text-xs font-bold">
								{item.mediaType === 'before_after' ? 'Before & after' : item.mediaType === 'video' ? 'Video' : 'Photo'}
							</span>
							{#if item.featured}<span class="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-sun" title="Featured"><Star size={14} class="fill-ink" /></span>{/if}
						</div>
						<div class="p-4">
							<p class="font-bold">{item.title || 'Untitled'}</p>
							<p class="text-sm text-slate">{categoryLabel(item.category)} · {item.published ? 'Published' : 'Hidden'}</p>
							<details class="mt-3">
								<summary class="cursor-pointer text-sm font-semibold underline">Edit details</summary>
								<form method="POST" action="?/update" class="mt-3 space-y-3" use:enhance={() => async ({ update }) => update({ reset: false })}>
									<input type="hidden" name="id" value={item._id} />
									<input name="title" value={item.title ?? ''} maxlength="140" class="input !py-2 text-sm" aria-label="Title" placeholder="Title" />
									<textarea name="caption" rows="2" maxlength="600" class="input !py-2 text-sm" aria-label="Caption" placeholder="Caption">{item.caption ?? ''}</textarea>
									<input name="alt" value={item.alt ?? ''} maxlength="200" class="input !py-2 text-sm" aria-label="Alt text" placeholder="Alt text" />
									<div class="grid grid-cols-[1fr_5rem] gap-2">
										<select name="category" class="input !py-2 text-sm" aria-label="Category">
											{#each GALLERY_CATEGORIES as c}<option value={c.value} selected={item.category === c.value}>{c.label}</option>{/each}
										</select>
										<input name="order" type="number" min="0" value={item.order} class="input !py-2 text-sm" aria-label="Order" />
									</div>
									<div class="flex gap-4 text-sm">
										<label class="flex items-center gap-2"><input type="checkbox" name="published" checked={item.published} class="accent-ink" /> Published</label>
										<label class="flex items-center gap-2"><input type="checkbox" name="featured" checked={item.featured} class="accent-ink" /> Featured</label>
									</div>
									<button class="btn btn-ink btn-sm">Save</button>
								</form>
							</details>
							<div class="mt-3 flex gap-2">
								<form method="POST" action="?/toggle" use:enhance>
									<input type="hidden" name="id" value={item._id} />
									<button class="btn btn-ghost btn-sm">{#if item.published}<EyeOff size={15} aria-hidden="true" /> Unpublish{:else}<Eye size={15} aria-hidden="true" /> Publish{/if}</button>
								</form>
								<form method="POST" action="?/delete" use:enhance={({ cancel }) => { if (!confirm('Delete this gallery item and its files permanently?')) cancel(); }}>
									<input type="hidden" name="id" value={item._id} />
									<button class="btn btn-sm border-2 border-line text-bad hover:border-bad" aria-label="Delete"><Trash2 size={15} /></button>
								</form>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="a-card p-8 text-slate">Nothing in the gallery yet. Add your first photo, video or before-and-after pair.</div>
		{/if}
	</section>
</div>
