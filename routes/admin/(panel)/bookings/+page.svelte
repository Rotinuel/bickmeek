<script>
	import { page } from '$app/state';
	import { Search } from '@lucide/svelte';
	import StatusBadge from '$lib/components/admin/StatusBadge.svelte';
	import { BOOKING_STATUSES, frequencyLabel } from '$lib/constants.js';
	import { formatDate, formatDateTime } from '$lib/format.js';
	import { waLink } from '$lib/whatsapp.js';

	let { data } = $props();
	const f = $derived(data.filters);

	function pageHref(n) {
		const u = new URL(page.url);
		u.searchParams.set('page', String(n));
		return u.pathname + u.search;
	}
</script>

<svelte:head><title>Bookings · BiceMeek admin</title></svelte:head>

<div class="flex flex-wrap items-end justify-between gap-4">
	<div>
		<h1 class="headline text-3xl">Bookings</h1>
		<p class="mt-1 text-slate">{data.count} {data.count === 1 ? 'enquiry' : 'enquiries'} match your filters.</p>
	</div>
</div>

<form method="GET" class="a-card mt-6 grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
	<div class="relative">
		<label for="q" class="sr-only">Search</label>
		<Search size={18} class="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate" aria-hidden="true" />
		<input id="q" name="q" value={f.q} placeholder="Name, phone, reference, area…" class="input !py-2.5 !pl-10" />
	</div>
	<select name="status" class="input !py-2.5" aria-label="Status">
		<option value="">All statuses</option>
		<option value="pending" selected={f.status === 'pending'}>Pending (contacted + quoted)</option>
		{#each BOOKING_STATUSES as s}<option value={s.value} selected={f.status === s.value}>{s.label}</option>{/each}
	</select>
	<select name="frequency" class="input !py-2.5" aria-label="Frequency">
		<option value="">All frequencies</option>
		<option value="recurring" selected={f.frequency === 'recurring'}>All recurring</option>
		{#each ['one_time', 'daily', 'weekly', 'monthly'] as fr}<option value={fr} selected={f.frequency === fr}>{frequencyLabel(fr)}</option>{/each}
	</select>
	<select name="service" class="input !py-2.5" aria-label="Service">
		<option value="">All services</option>
		{#each data.serviceOptions as s}<option value={s.slug} selected={f.service === s.slug}>{s.name}</option>{/each}
	</select>
	<select name="type" class="input !py-2.5" aria-label="Request type">
		<option value="">Bookings & quotes</option>
		<option value="booking" selected={f.type === 'booking'}>Bookings only</option>
		<option value="quote" selected={f.type === 'quote'}>Quotations only</option>
	</select>
	<div class="flex gap-2">
		<button class="btn btn-ink btn-sm">Filter</button>
		<a href="/admin/bookings" class="btn btn-ghost btn-sm">Clear</a>
	</div>
</form>

<div class="a-card mt-6 overflow-hidden">
	{#if data.items.length}
		<div class="overflow-x-auto">
			<table class="a-table min-w-[880px]">
				<thead>
					<tr><th>Reference</th><th>Customer</th><th>Service</th><th>Frequency</th><th>Preferred</th><th>Status</th><th>Received</th><th><span class="sr-only">Actions</span></th></tr>
				</thead>
				<tbody>
					{#each data.items as b}
						<tr class="hover:bg-mist">
							<td><a href="/admin/bookings/{b._id}" class="font-bold underline">{b.ref}</a>{#if b.requestType === 'quote'}<span class="block text-xs text-slate">Quotation</span>{/if}</td>
							<td>{b.fullName}<span class="block text-xs text-slate">{b.phone}{b.area ? `, ${b.area}` : ''}</span></td>
							<td>{b.serviceName}</td>
							<td>{frequencyLabel(b.frequency)}</td>
							<td class="text-slate">{formatDate(b.preferredDate) || '—'}<span class="block text-xs">{b.preferredTime || ''}</span></td>
							<td><StatusBadge status={b.status} /></td>
							<td class="text-slate">{formatDateTime(b.createdAt)}</td>
							<td>
								<a href={waLink(b.phone.replace(/^0/, '234'), `Hello ${b.fullName.split(' ')[0]}, this is BiceMeek Cleaning Services about your request ${b.ref}.`)} target="_blank" rel="noopener" class="text-sm font-semibold text-[#177040] underline">WhatsApp</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="p-8 text-slate">No enquiries match these filters.</p>
	{/if}
</div>

{#if data.pages > 1}
	<nav class="mt-6 flex items-center justify-between" aria-label="Pagination">
		{#if data.page > 1}<a href={pageHref(data.page - 1)} class="btn btn-ghost btn-sm">Previous</a>{:else}<span></span>{/if}
		<span class="text-sm text-slate">Page {data.page} of {data.pages}</span>
		{#if data.page < data.pages}<a href={pageHref(data.page + 1)} class="btn btn-ghost btn-sm">Next</a>{:else}<span></span>{/if}
	</nav>
{/if}
