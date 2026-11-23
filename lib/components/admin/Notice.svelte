<script>
	import { CircleCheck, TriangleAlert } from '@lucide/svelte';
	/** Shows the result of the last admin form action. */
	let { form } = $props();
</script>

{#if form?.error}
	<div class="mb-6 flex gap-3 rounded-2xl border-2 border-bad bg-paper p-4" role="alert">
		<TriangleAlert size={20} class="shrink-0 text-bad" aria-hidden="true" />
		<p class="font-semibold">{form.error}</p>
	</div>
{:else if form?.saved}
	<div class="mb-6 flex gap-3 rounded-2xl bg-[#e3f4ec] p-4" role="status">
		<CircleCheck size={20} class="shrink-0 text-ok" aria-hidden="true" />
		<p class="font-semibold">{form.saved}</p>
	</div>
{/if}
