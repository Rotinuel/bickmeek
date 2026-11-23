<script>
	import StatusBadge from '$lib/components/admin/StatusBadge.svelte';
	import { frequencyLabel } from '$lib/constants.js';
	import { formatDateTime } from '$lib/format.js';

	let { data } = $props();
	const st = $derived(data.stats);
	const cards = $derived([
		{ label: 'New enquiries', value: st.new, href: '/admin/bookings?status=new', accent: true },
		{ label: 'Pending (contacted or quoted)', value: st.pending, href: '/admin/bookings?status=pending' },
		{ label: 'Confirmed or in progress', value: st.confirmed, href: '/admin/bookings?status=confirmed' },
		{ label: 'Completed', value: st.completed, href: '/admin/bookings?status=completed' },
		{ label: 'Cancelled', value: st.cancelled, href: '/admin/bookings?status=cancelled' },
		{ label: 'Recurring plan enquiries', value: st.recurring, href: '/admin/bookings?frequency=recurring' },
		{ label: 'All enquiries', value: st.total, href: '/admin/bookings' },
		{ label: 'Received in the last 7 days', value: st.thisWeek, href: '/admin/bookings' }
	]);
</script>

<svelte:head><title>Overview · BiceMeek admin</title></svelte:head>

<h1 class="headline text-3xl">Good to see you, {data.admin.name?.split(' ')[0] || 'admin'}</h1>
<p class="mt-1 text-slate">Here’s what’s happening with bookings.</p>

<ul class="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
	{#each cards as c}
		<li>
			<a href={c.href} class="block h-full rounded-2xl p-5 transition-shadow hover:shadow-md {c.accent ? 'bg-sun' : 'bg-paper'}">
				<p class="display text-4xl">{c.value}</p>
				<p class="mt-2 text-sm font-semibold {c.accent ? '' : 'text-slate'}">{c.label}</p>
			</a>
		</li>
	{/each}
</ul>

<section class="a-card mt-8 overflow-hidden">
	<div class="flex items-center justify-between border-b border-line px-5 py-4">
		<h2 class="text-lg font-bold">Recent enquiries</h2>
		<a href="/admin/bookings" class="text-sm font-semibold underline">View all</a>
	</div>
	{#if data.recent.length}
		<div class="overflow-x-auto">
			<table class="a-table min-w-[720px]">
				<thead>
					<tr><th>Reference</th><th>Customer</th><th>Service</th><th>Frequency</th><th>Status</th><th>Received</th></tr>
				</thead>
				<tbody>
					{#each data.recent as b}
						<tr class="hover:bg-mist">
							<td><a href="/admin/bookings/{b._id}" class="font-bold underline">{b.ref}</a></td>
							<td>{b.fullName}<span class="block text-xs text-slate">{b.phone}</span></td>
							<td>{b.serviceName}{#if b.requestType === 'quote'}<span class="block text-xs text-slate">Quotation</span>{/if}</td>
							<td>{frequencyLabel(b.frequency)}</td>
							<td><StatusBadge status={b.status} /></td>
							<td class="text-slate">{formatDateTime(b.createdAt)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="p-6 text-slate">No enquiries yet. Requests from the website’s booking forms will appear here.</p>
	{/if}
</section>
