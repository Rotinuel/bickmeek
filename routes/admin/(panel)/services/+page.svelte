<script>
	import { enhance } from '$app/forms';
	import { Plus, Eye, EyeOff, Pencil, Trash2, ExternalLink } from '@lucide/svelte';
	import Notice from '$lib/components/admin/Notice.svelte';
	import ServiceIcon from '$lib/components/ServiceIcon.svelte';

	let { data, form } = $props();
</script>

<svelte:head><title>Services · BiceMeek admin</title></svelte:head>

<div class="flex flex-wrap items-end justify-between gap-4">
	<div>
		<h1 class="headline text-3xl">Services</h1>
		<p class="mt-1 text-slate">Each service has its own page on the website. Hidden services are removed from menus, forms and the sitemap.</p>
	</div>
	<a href="/admin/services/new" class="btn btn-ink btn-sm"><Plus size={18} aria-hidden="true" /> Add service</a>
</div>

<div class="mt-6"><Notice {form} /></div>

<ul class="a-card divide-y divide-line">
	{#each data.services as s (s._id)}
		<li class="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
			<span class="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-mist">
				{#if s.image}<img src={s.image} alt="" class="h-full w-full object-cover" />{:else}<ServiceIcon name={s.icon} />{/if}
			</span>
			<div class="min-w-0 flex-1">
				<p class="font-bold">{s.name} {#if !s.enabled}<span class="ml-2 rounded-full bg-mist px-2 py-0.5 text-xs font-semibold text-slate">Hidden</span>{/if}</p>
				<p class="truncate text-sm text-slate">/services/{s.slug} · order {s.order}</p>
			</div>
			<div class="flex flex-wrap gap-2">
				{#if s.enabled}
					<a href="/services/{s.slug}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" aria-label="View {s.name} on website"><ExternalLink size={16} /></a>
				{/if}
				<a href="/admin/services/{s._id}" class="btn btn-ghost btn-sm"><Pencil size={16} aria-hidden="true" /> Edit</a>
				<form method="POST" action="?/toggle" use:enhance>
					<input type="hidden" name="id" value={s._id} />
					<button class="btn btn-ghost btn-sm">
						{#if s.enabled}<EyeOff size={16} aria-hidden="true" /> Hide{:else}<Eye size={16} aria-hidden="true" /> Show{/if}
					</button>
				</form>
				<form method="POST" action="?/delete" use:enhance={({ cancel }) => { if (!confirm(`Delete ${s.name}? Its page will stop working.`)) cancel(); }}>
					<input type="hidden" name="id" value={s._id} />
					<button class="btn btn-sm border-2 border-line text-bad hover:border-bad" aria-label="Delete {s.name}"><Trash2 size={16} /></button>
				</form>
			</div>
		</li>
	{:else}
		<li class="p-6 text-slate">No services yet. Add your first service.</li>
	{/each}
</ul>
