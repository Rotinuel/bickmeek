<script>
	import { ShieldCheck, HandHeart, Clock3, Smile, Sparkles } from '@lucide/svelte';
	let { name, size = 26, class: klass = '' } = $props();
	const MAP = { shield: ShieldCheck, hygiene: HandHeart, clock: Clock3, smile: Smile };
	const Icon = $derived(MAP[name] ?? Sparkles);
</script>

<Icon {size} class={klass} aria-hidden="true" />
