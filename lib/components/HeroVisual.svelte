<script>
	import { MapPin, CalendarCheck } from '@lucide/svelte';

	/** Shows the admin-uploaded hero photo, or an illustrated "half-cleaned window" until one is added. */
	let { image = '', alt = '' } = $props();
</script>

<div class="relative">
	{#if image}
		<img
			src={image}
			alt={alt || 'BiceMeek cleaning team at work in Minna'}
			class="aspect-[4/5] w-full rounded-[var(--radius-blob)] object-cover sm:aspect-[5/5]"
			fetchpriority="high"
			decoding="async"
		/>
	{:else}
		<div class="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-blob)] bg-sun sm:aspect-square" aria-hidden="true">
			<svg viewBox="0 0 400 400" class="absolute inset-0 h-full w-full">
				<defs>
					<pattern id="dust" width="14" height="14" patternUnits="userSpaceOnUse">
						<circle cx="3" cy="4" r="1.3" fill="#000" opacity=".16" />
						<circle cx="10" cy="11" r="1" fill="#000" opacity=".12" />
					</pattern>
					<clipPath id="pane"><rect x="70" y="60" width="260" height="280" rx="10" /></clipPath>
				</defs>
				<!-- window -->
				<g clip-path="url(#pane)">
					<rect x="70" y="60" width="260" height="280" fill="#fff" />
					<!-- dusty half -->
					<polygon points="70,60 205,60 160,340 70,340" fill="#d8d6cc" />
					<polygon points="70,60 205,60 160,340 70,340" fill="url(#dust)" />
					<!-- streaks on clean half -->
					<path d="M250 95 l40 -10 M262 120 l46 -12" stroke="#ffc20e" stroke-width="5" stroke-linecap="round" />
				</g>
				<rect x="70" y="60" width="260" height="280" rx="10" fill="none" stroke="#000" stroke-width="12" />
				<line x1="200" y1="60" x2="200" y2="340" stroke="#000" stroke-width="10" />
				<line x1="70" y1="200" x2="330" y2="200" stroke="#000" stroke-width="10" />
				<!-- squeegee -->
				<g transform="rotate(14 205 205)">
					<rect x="180" y="40" width="22" height="300" rx="5" fill="#000" />
					<rect x="170" y="45" width="42" height="290" rx="6" fill="none" stroke="#000" stroke-width="4" />
					<rect x="200" y="170" width="120" height="16" rx="8" fill="#000" transform="rotate(-14 200 178)" />
				</g>
				<!-- sparkle -->
				<path d="M292 248 l7 16 16 7 -16 7 -7 16 -7 -16 -16 -7 16 -7Z" fill="#000" />
				<path d="M262 292 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4Z" fill="#000" />
			</svg>
		</div>
	{/if}

	<div class="absolute -bottom-5 left-4 flex flex-col gap-2 sm:-left-6">
		<span class="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-paper shadow-lg">
			<CalendarCheck size={17} class="text-sun" aria-hidden="true" /> Daily, weekly and monthly plans
		</span>
		<span class="inline-flex w-fit items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-sm font-bold shadow-lg ring-2 ring-ink">
			<MapPin size={17} aria-hidden="true" /> Serving Minna, Niger State
		</span>
	</div>
</div>
