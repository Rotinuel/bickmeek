<script>
	import { Check } from '@lucide/svelte';
	import { page } from '$app/state';
	import { formatNaira } from '$lib/format.js';
	import { waLink, primaryWhatsApp, waMessage } from '$lib/whatsapp.js';
	import WhatsAppIcon from './WhatsAppIcon.svelte';

	/**
	 * Three plans side by side; the highlighted one sits on a yellow field.
	 * `onchoose(key)` lets a page scroll to its own form instead of linking to /book.
	 */
	let { plans = [], onchoose = null } = $props();
	const settings = $derived(page.data.settings);
</script>

<div class="grid gap-5 lg:grid-cols-3 lg:items-stretch">
	{#each plans as plan (plan.key)}
		<article
			class="relative flex flex-col rounded-[2rem] p-7 sm:p-9 {plan.highlighted
				? 'bg-sun text-ink lg:-my-4 lg:py-12'
				: 'border-2 border-line bg-paper'}"
			aria-labelledby="plan-{plan.key}"
		>
			{#if plan.highlighted}
				<p class="mb-4 w-fit rounded-full bg-ink px-3 py-1 text-xs font-bold text-sun">Most chosen</p>
			{/if}
			<h3 id="plan-{plan.key}" class="headline text-3xl">{plan.name}</h3>
			<p class="mt-2 text-lg font-semibold">{plan.tagline}</p>

			<div class="mt-6 border-t-2 pt-6 {plan.highlighted ? 'border-ink/15' : 'border-line'}">
				{#if plan.price}
					<p class="display text-4xl">{formatNaira(plan.price)}</p>
					<p class="mt-1 text-sm font-semibold">{plan.priceUnit}</p>
				{:else}
					<p class="display text-3xl">Custom quote</p>
				{/if}
				{#if plan.priceNote}<p class="mt-2 text-sm {plan.highlighted ? 'text-ink/75' : 'text-slate'}">{plan.priceNote}</p>{/if}
			</div>

			<p class="mt-6 {plan.highlighted ? 'text-ink/85' : 'text-slate'}">{plan.description}</p>

			<ul class="mt-6 flex-1 space-y-3">
				{#each plan.inclusions as inc}
					<li class="flex gap-3">
						<span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full {plan.highlighted ? 'bg-ink text-sun' : 'bg-sun text-ink'}">
							<Check size={14} strokeWidth={3} aria-hidden="true" />
						</span>
						<span>{inc}</span>
					</li>
				{/each}
			</ul>

			{#if plan.bestFor}
				<p class="mt-6 text-sm"><span class="font-bold">Best for:</span> {plan.bestFor}</p>
			{/if}

			<div class="mt-8 flex flex-col gap-2">
				{#if onchoose}
					<button type="button" class="btn {plan.highlighted ? 'btn-ink' : 'btn-sun'}" onclick={() => onchoose(plan.key)}>
						Request {plan.name.toLowerCase()}
					</button>
				{:else}
					<a href="/book?frequency={plan.key}" class="btn {plan.highlighted ? 'btn-ink' : 'btn-sun'}">Request {plan.name.toLowerCase()}</a>
				{/if}
				<a
					href={waLink(primaryWhatsApp(settings), waMessage.plan(plan.name, settings?.businessName))}
					target="_blank"
					rel="noopener"
					class="btn {plan.highlighted ? 'btn-ghost' : 'btn-ghost'}"
				>
					<WhatsAppIcon size={18} /> Ask on WhatsApp
				</a>
			</div>
		</article>
	{/each}
</div>
