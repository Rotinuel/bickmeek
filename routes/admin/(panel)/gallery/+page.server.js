import { fail } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { plain } from '$lib/server/db.js';
import { GalleryItem, GALLERY_CATEGORIES } from '$lib/server/models.js';
import { adminAction, mediaField } from '$lib/server/admin.js';
import { deleteUpload, storageDriver } from '$lib/server/storage.js';
import { bool, clean, int } from '$lib/server/validate.js';

export async function load() {
	const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 }).lean();
	return { items: plain(items), driver: storageDriver() };
}

const category = (v) => (GALLERY_CATEGORIES.some((c) => c.value === v) ? v : 'residential');

async function byId(fd) {
	const id = clean(fd.get('id'), 40);
	return mongoose.isValidObjectId(id) ? GalleryItem.findById(id) : null;
}

export const actions = {
	create: adminAction(async ({ request }) => {
		const fd = await request.formData();
		const mediaType = clean(fd.get('mediaType'), 20);
		const base = {
			title: clean(fd.get('title'), 140),
			caption: clean(fd.get('caption'), 600),
			alt: clean(fd.get('alt'), 200),
			category: category(clean(fd.get('category'), 40)),
			published: bool(fd.get('published')),
			featured: bool(fd.get('featured')),
			order: int(fd.get('order'), { min: 0, max: 9999, fallback: 0 })
		};

		if (mediaType === 'before_after') {
			const before = await mediaField(fd, 'before');
			const after = await mediaField(fd, 'after');
			if (!before.url || !after.url) {
				await deleteUpload(before.key);
				await deleteUpload(after.key);
				return fail(400, { error: 'Add both a before photo and an after photo.' });
			}
			await GalleryItem.create({
				...base,
				mediaType,
				beforeUrl: before.url,
				afterUrl: after.url,
				storageKeys: [before.key, after.key].filter(Boolean)
			});
		} else if (mediaType === 'image' || mediaType === 'video') {
			const media = await mediaField(fd, 'media', {}, { kind: mediaType });
			if (!media.url) return fail(400, { error: `Choose a ${mediaType} to upload or paste a link.` });
			await GalleryItem.create({ ...base, mediaType, url: media.url, storageKeys: media.key ? [media.key] : [] });
		} else {
			return fail(400, { error: 'Choose what you are adding: photo, video or before-and-after.' });
		}
		return { saved: 'Added to the gallery.' };
	}),

	update: adminAction(async ({ request }) => {
		const fd = await request.formData();
		const item = await byId(fd);
		if (!item) return fail(404, { error: 'Item not found.' });
		item.title = clean(fd.get('title'), 140);
		item.caption = clean(fd.get('caption'), 600);
		item.alt = clean(fd.get('alt'), 200);
		item.category = category(clean(fd.get('category'), 40));
		item.order = int(fd.get('order'), { min: 0, max: 9999, fallback: 0 });
		item.published = bool(fd.get('published'));
		item.featured = bool(fd.get('featured'));
		await item.save();
		return { saved: 'Gallery item updated.' };
	}),

	toggle: adminAction(async ({ request }) => {
		const item = await byId(await request.formData());
		if (!item) return fail(404, { error: 'Item not found.' });
		item.published = !item.published;
		await item.save();
		return { saved: item.published ? 'Published.' : 'Unpublished — hidden from the website.' };
	}),

	delete: adminAction(async ({ request }) => {
		const item = await byId(await request.formData());
		if (!item) return fail(404, { error: 'Item not found.' });
		for (const key of item.storageKeys) await deleteUpload(key);
		await item.deleteOne();
		return { saved: 'Deleted from the gallery.' };
	})
};
