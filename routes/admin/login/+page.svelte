<script>
	import { enhance } from '$app/forms';
	import { LoaderCircle } from '@lucide/svelte';
	import Logo from '$lib/components/Logo.svelte';

	let { data, form } = $props();
	let busy = $state(false);
</script>

<svelte:head>
	<title>Sign in · BiceMeek admin</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="grid min-h-screen lg:grid-cols-2">
	<div class="hidden flex-col justify-between bg-ink p-12 text-paper lg:flex">
		<Logo tone="light" />
		<div>
			<p class="display text-5xl">Manage bookings, plans and your website in one place.</p>
		</div>
		<p class="text-sm text-paper/50">BiceMeek Cleaning Services · Admin</p>
	</div>
	<div class="flex items-center justify-center p-6 sm:p-12">
		<div class="w-full max-w-sm">
			<div class="mb-10 lg:hidden"><Logo /></div>
			<h1 class="headline text-3xl">Sign in</h1>
			<p class="mt-2 text-slate">Admin access only.</p>

			{#if !data.hasAdmin}
				<div class="mt-6 rounded-2xl bg-sun-soft p-4 text-sm">
					No admin account exists yet. Set <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> (12+ characters) in your
					environment and restart, or run <code>bun run create-admin</code>.
				</div>
			{/if}

			{#if form?.error}
				<p class="mt-6 rounded-2xl border-2 border-bad p-4 text-sm font-semibold text-bad" role="alert">{form.error}</p>
			{/if}

			<form
				method="POST"
				class="mt-8 space-y-5"
				use:enhance={() => {
					busy = true;
					return async ({ update }) => {
						await update();
						busy = false;
					};
				}}
			>
				<div>
					<label for="email" class="field-label">Email</label>
					<input id="email" name="email" type="email" autocomplete="username" required class="input" value={form?.email ?? ''} />
				</div>
				<div>
					<label for="password" class="field-label">Password</label>
					<input id="password" name="password" type="password" autocomplete="current-password" required class="input" />
				</div>
				<button class="btn btn-ink w-full" disabled={busy}>
					{#if busy}<LoaderCircle size={18} class="animate-spin" aria-hidden="true" />{/if}
					Sign in
				</button>
			</form>
			<p class="mt-8 text-sm"><a href="/" class="underline">Back to the website</a></p>
		</div>
	</div>
</main>
