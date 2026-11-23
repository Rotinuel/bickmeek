<script>
	import {
		Bath,
		Brush,
		Building2,
		CalendarCheck,
		HardHat,
		House,
		Shirt,
		Sofa,
		Sparkles,
		SprayCan,
		Truck,
		WashingMachine
	} from '@lucide/svelte';

	let { name = 'sparkles', size = 24, class: klass = '', strokeWidth = 1.75 } = $props();

	const MAP = {
		home: House,
		building: Building2,
		'hard-hat': HardHat,
		sparkles: Sparkles,
		truck: Truck,
		shirt: Shirt,
		'spray-can': SprayCan,
		brush: Brush,
		calendar: CalendarCheck,
		sofa: Sofa,
		bath: Bath,
		'washing-machine': WashingMachine
	};

	const Icon = $derived(MAP[name] ?? Sparkles);
</script>

<Icon {size} {strokeWidth} class={klass} aria-hidden="true" />
