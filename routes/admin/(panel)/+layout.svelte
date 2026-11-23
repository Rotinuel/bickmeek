<script>
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import {
		LayoutDashboard,
		CalendarCheck,
		Sparkles,
		Repeat,
		Images,
		MessageSquareQuote,
		Settings,
		Search,
		LogOut,
		Menu,
		X,
		ExternalLink
	} from '@lucide/svelte';
	import Logo from '$lib/components/Logo.svelte';

	let { data, children } = $props();
	let open = $state(false);
	afterNavigate(() => (open = false));

	const nav = [
		{ href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
		{ href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck, badge: true },
		{ href: '/admin/services', label: 'Services', icon: Sparkles },
		{ href: '/admin/plans', label: 'Cleaning plans', icon: Repeat },
		{ href: '/admin/gallery', label: 'Gallery', icon: Images },
		{ href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
		{ href: '/admin/settings', label: 'Business settings', icon: Settings },
		{ href: '/admin/seo', label: 'SEO', icon: Search }
	];
	const isActive = (item) =>
		item.exact ? page.url.pathname === item.href : page.url.pathname === item.href || page.url.pathname.startsWith(item.href + '/');
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-mist lg:grid lg:grid-cols-[17rem_1fr]">
	<!-- Mobile top bar -->
	<div class="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-paper px-4 py-3 lg:hidden">
		<a href="/admin"><Logo /></a>
		<button type="button" class="grid h-11 w-11 place-items-center rounded-full border-2 border-ink" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onclick={() => (open = !open)}>
			{#if open}<X size={20} />{:else}<Menu size={20} />{/if}
		</button>
	</div>

	<aside
		class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-ink text-paper transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:translate-x-0 {open ? 'translate-x-0' : '-translate-x-full'}"
	>
		<div class="p-6"><a href="/admin"><Logo tone="light" /></a></div>
		<nav class="flex-1 overflow-y-auto px-3" aria-label="Admin">
			<ul class="space-y-1">
				{#each nav as item}
					<li>
						<a
							href={item.href}
							aria-current={isActive(item) ? 'page' : undefined}
							class="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper aria-[current=page]:bg-sun aria-[current=page]:text-ink"
						>
							<item.icon size={19} aria-hidden="true" />
							<span class="flex-1">{item.label}</span>
							{#if item.badge && data.newCount}
								<span class="rounded-full bg-paper px-2 py-0.5 text-xs font-bold text-ink">{data.newCount}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="space-y-1 border-t border-paper/15 p-3">
			<a href="/" target="_blank" rel="noopener" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-paper/70 hover:bg-paper/10">
				<ExternalLink size={17} aria-hidden="true" /> View website
			</a>
			<form method="POST" action="/admin/logout">
				<button class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-paper/70 hover:bg-paper/10">
					<LogOut size={17} aria-hidden="true" /> Sign out
				</button>
			</form>
			<p class="truncate px-3 pt-2 text-xs text-paper/45">{data.admin.email}</p>
		</div>
	</aside>
	{#if open}
		<button type="button" class="fixed inset-0 z-40 bg-ink/50 lg:hidden" aria-label="Close menu" onclick={() => (open = false)}></button>
	{/if}

	<div class="min-w-0 p-4 sm:p-8 lg:p-10">
		{@render children()}
	</div>
</div>
