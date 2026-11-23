<script>
	import WhatsAppButton from './WhatsAppButton.svelte';

	let {
		title = 'Ready for a cleaner space?',
		text = 'Send a request in two minutes, or message us on WhatsApp and we’ll reply with a quotation.',
		primaryHref = '/book',
		primaryLabel = 'Book a cleaning',
		waText = 'Hello BiceMeek Cleaning Services, I would like to book a cleaning.'
	} = $props();
</script>

<section class="bg-sun">
	<div class="wrap grid items-end gap-8 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr]">
		<div>
			<h2 class="display text-[clamp(2.25rem,5vw,4rem)]">{title}</h2>
			<p class="mt-4 max-w-[52ch] text-lg text-ink/80">{text}</p>
		</div>
		<div class="flex flex-wrap gap-3 lg:justify-end">
			<a href={primaryHref} class="btn btn-ink">{primaryLabel}</a>
			<WhatsAppButton message={waText} label="WhatsApp us" class="btn btn-ghost" />
		</div>
	</div>
</section>
