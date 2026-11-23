<script>
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { Menu, X, Phone } from '@lucide/svelte';
	import Logo from './Logo.svelte';
	import { formatPhone, telLink } from '$lib/whatsapp.js';

	let { settings } = $props();
	let open = $state(false);
	let scrolled = $state(false);

	const links = [
		{ href: '/services', label: 'Services' },
		{ href: '/cleaning-plans', label: 'Cleaning plans' },
		{ href: '/gallery', label: 'Our work' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	];

	const active = (href) => page.url.pathname === href || page.url.pathname.startsWith(href + '/');

	afterNavigate(() => (open = false));

	$effect(() => {
		const onScroll = () => (scrolled = window.scrollY > 8);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	$effect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
		const onKey = (e) => e.key === 'Escape' && (open = false);
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<a href="#main" class="sr-only z-[100] rounded-full bg-sun px-4 py-2 font-bold focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
	Skip to content
</a>

<header
	class="sticky top-0 z-50 border-b bg-paper/95 backdrop-blur transition-colors {scrolled ? 'border-line' : 'border-transparent'}"
>
	<nav class="wrap flex h-18 items-center justify-between gap-6" aria-label="Main">
		<a href="/" class="shrink-0" aria-label="{settings.businessName} home">
			<Logo />
		</a>

		<ul class="hidden items-center gap-1 lg:flex">
			{#each links as link}
				<li>
					<a
						href={link.href}
						aria-current={active(link.href) ? 'page' : undefined}
						class="rounded-full px-4 py-2 text-[0.95rem] font-semibold transition-colors hover:bg-mist aria-[current=page]:bg-ink aria-[current=page]:text-paper"
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>

		<div class="flex items-center gap-2">
			{#if settings.phones?.[0]}
				<a href={telLink(settings.phones[0])} class="hidden items-center gap-2 px-3 text-sm font-semibold xl:inline-flex">
					<Phone size={16} aria-hidden="true" />
					{formatPhone(settings.phones[0])}
				</a>
			{/if}
			<a href="/book" class="btn btn-sun btn-sm hidden sm:inline-flex">Book a cleaning</a>
			<button
				type="button"
				class="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink lg:hidden"
				aria-expanded={open}
				aria-controls="mobile-nav"
				aria-label={open ? 'Close menu' : 'Open menu'}
				onclick={() => (open = !open)}
			>
				{#if open}<X size={20} />{:else}<Menu size={20} />{/if}
			</button>
		</div>
	</nav>
</header>

<!-- Outside the header: its backdrop-blur would otherwise trap this fixed panel inside the header's 72px box. -->
{#if open}
	<div id="mobile-nav" class="fixed inset-x-0 top-18 bottom-0 z-40 overflow-y-auto bg-ink text-paper lg:hidden">
		<ul class="wrap flex flex-col py-6">
			{#each links as link}
				<li>
					<a
						href={link.href}
						aria-current={active(link.href) ? 'page' : undefined}
						class="headline flex items-center justify-between border-b border-paper/15 py-5 text-3xl aria-[current=page]:text-sun"
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
		<div class="wrap flex flex-col gap-3 pb-10">
			<a href="/book" class="btn btn-sun">Book a cleaning</a>
			<a href="/cleaning-subscription" class="btn btn-ghost-light">See regular cleaning plans</a>
		</div>
	</div>
{/if}

