<script>
	import { MapPin, Phone, Mail, Clock } from '@lucide/svelte';
	import Logo from './Logo.svelte';
	import WhatsAppButton from './WhatsAppButton.svelte';
	import { formatPhone, telLink, waMessage } from '$lib/whatsapp.js';

	let { settings, services = [] } = $props();
	const year = new Date().getFullYear();
	const socials = $derived(
		[
			['Facebook', settings.social?.facebook],
			['Instagram', settings.social?.instagram],
			['TikTok', settings.social?.tiktok],
			['X', settings.social?.x],
			['LinkedIn', settings.social?.linkedin],
			['YouTube', settings.social?.youtube]
		].filter(([, url]) => url)
	);
</script>

<footer class="bg-ink text-paper">
	<div class="wrap grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
		<div>
			<Logo tone="light" />
			<p class="mt-5 max-w-xs text-paper/70">{settings.tagline}</p>
			<p class="mt-2 max-w-xs font-semibold text-sun">{settings.slogan}</p>
			<div class="mt-6">
				<WhatsAppButton message={waMessage.general(settings.businessName)} label="Message us" class="btn btn-wa btn-sm" />
			</div>
		</div>

		<nav aria-label="Services">
			<h2 class="text-sm font-bold text-paper/60">Services</h2>
			<ul class="mt-4 space-y-2.5">
				{#each services as s}
					<li><a href="/services/{s.slug}" class="hover:text-sun">{s.name}</a></li>
				{/each}
				<li><a href="/cleaning-plans" class="hover:text-sun">Daily, weekly & monthly plans</a></li>
			</ul>
		</nav>

		<nav aria-label="Company">
			<h2 class="text-sm font-bold text-paper/60">Company</h2>
			<ul class="mt-4 space-y-2.5">
				<li><a href="/about" class="hover:text-sun">About us</a></li>
				<li><a href="/gallery" class="hover:text-sun">Our work</a></li>
				<li><a href="/testimonials" class="hover:text-sun">Reviews</a></li>
				<li><a href="/book" class="hover:text-sun">Book a cleaning</a></li>
				<li><a href="/contact" class="hover:text-sun">Contact</a></li>
				<li><a href="/privacy-policy" class="hover:text-sun">Privacy policy</a></li>
				<li><a href="/terms" class="hover:text-sun">Terms of service</a></li>
			</ul>
		</nav>

		<div>
			<h2 class="text-sm font-bold text-paper/60">Visit or call</h2>
			<address class="mt-4 space-y-4 not-italic">
				<p class="flex gap-3">
					<MapPin size={20} class="mt-0.5 shrink-0 text-sun" aria-hidden="true" />
					<span>{settings.streetAddress},<br />{settings.city}, {settings.state}, {settings.country}</span>
				</p>
				{#each settings.phones as p}
					<p class="flex gap-3">
						<Phone size={20} class="mt-0.5 shrink-0 text-sun" aria-hidden="true" />
						<a href={telLink(p)} class="hover:text-sun">{formatPhone(p)}</a>
					</p>
				{/each}
				{#if settings.email}
					<p class="flex gap-3">
						<Mail size={20} class="mt-0.5 shrink-0 text-sun" aria-hidden="true" />
						<a href="mailto:{settings.email}" class="break-all hover:text-sun">{settings.email}</a>
					</p>
				{/if}
				{#if settings.openingHours?.length}
					<div class="flex gap-3">
						<Clock size={20} class="mt-0.5 shrink-0 text-sun" aria-hidden="true" />
						<ul>
							{#each settings.openingHours as o}
								<li><span class="text-paper/70">{o.days}:</span> {o.hours}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</address>
			{#if socials.length}
				<ul class="mt-6 flex flex-wrap gap-2">
					{#each socials as [name, url]}
						<li>
							<a href={url} target="_blank" rel="noopener" class="inline-block rounded-full border border-paper/25 px-3 py-1.5 text-sm hover:border-sun hover:text-sun">{name}</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
	<div class="border-t border-paper/15">
		<div class="wrap flex flex-col gap-2 py-6 text-sm text-paper/60 sm:flex-row sm:justify-between">
			<p>© {year} {settings.businessName}. Minna, Niger State.</p>
			<p>Professional cleaning for homes, offices and businesses in Minna.</p>
		</div>
	</div>
</footer>
