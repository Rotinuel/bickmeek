import adapter from '@sveltejs/adapter-vercel';

/** No `src` folder: routes, lib, hooks and the app template live at the project root. */
const config = {
	kit: {
		adapter: adapter(),
		files: {
			assets: 'static',
			hooks: {
				client: 'hooks.client',
				server: 'hooks.server',
				universal: 'hooks'
			},
			lib: 'lib',
			params: 'params',
			routes: 'routes',
			serviceWorker: 'service-worker',
			appTemplate: 'app.html',
			errorTemplate: 'error.html'
		}
		// Cross-site form protection is on by default in SvelteKit; no csrf config needed.
	}
};

export default config;
