<script>
	/**
	 * Upload a file, paste a link, or remove the current media.
	 * Posts `<name>File`, `<name>Url`, `<name>Remove` — handled by mediaField() on the server.
	 */
	let { name, label = 'Image', current = '', kind = 'image', hint = '' } = $props();
	const uid = $props.id();
	let preview = $state('');

	function onFile(e) {
		const f = e.currentTarget.files?.[0];
		if (preview) URL.revokeObjectURL(preview);
		preview = f ? URL.createObjectURL(f) : '';
	}
	const shown = $derived(preview || current);
	const accept = $derived(kind === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/avif');
</script>

<fieldset class="rounded-2xl border border-line p-4">
	<legend class="px-1 text-sm font-semibold">{label}</legend>
	<div class="flex flex-col gap-4 sm:flex-row">
		<div class="grid h-28 w-full shrink-0 place-items-center overflow-hidden rounded-xl bg-mist sm:w-40">
			{#if shown}
				{#if kind === 'video'}
					<video src={shown} class="h-full w-full object-cover" muted></video>
				{:else}
					<img src={shown} alt="" class="h-full w-full object-cover" />
				{/if}
			{:else}
				<span class="text-xs text-slate">None</span>
			{/if}
		</div>
		<div class="flex-1 space-y-3">
			<div>
				<label for="{uid}-file" class="text-sm text-slate">Upload a file</label>
				<input id="{uid}-file" type="file" name="{name}File" {accept} onchange={onFile} class="mt-1 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:font-semibold file:text-paper" />
			</div>
			<div>
				<label for="{uid}-url" class="text-sm text-slate">…or paste a link</label>
				<input id="{uid}-url" type="url" name="{name}Url" value={current} placeholder="https://" class="input mt-1 !py-2 text-sm" />
			</div>
			{#if current}
				<label class="flex items-center gap-2 text-sm"><input type="checkbox" name="{name}Remove" /> Remove current {kind}</label>
			{/if}
			{#if hint}<p class="text-xs text-slate">{hint}</p>{/if}
		</div>
	</div>
</fieldset>
