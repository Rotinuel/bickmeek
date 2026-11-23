<script>
	import { statusLabel } from '$lib/constants.js';
	let { status } = $props();
	const STYLES = {
		new: 'bg-sun text-ink',
		contacted: 'bg-[#e6effa] text-[#1d4e89]',
		quotation_sent: 'bg-[#efe7fb] text-[#5b2c99]',
		confirmed: 'bg-[#e3f4ec] text-ok',
		in_progress: 'bg-[#fff1dd] text-warn',
		completed: 'bg-ink text-paper',
		cancelled: 'bg-[#fbe9e7] text-bad'
	};
</script>

<span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap {STYLES[status] ?? 'bg-mist'}">
	{statusLabel(status)}
</span>
