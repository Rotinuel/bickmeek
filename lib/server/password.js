import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb);
const KEYLEN = 64;
const PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

/** Hash format: scrypt$N$r$p$saltHex$hashHex */
export async function hashPassword(password) {
	const salt = randomBytes(16);
	const hash = await scrypt(String(password).normalize('NFKC'), salt, KEYLEN, PARAMS);
	return ['scrypt', PARAMS.N, PARAMS.r, PARAMS.p, salt.toString('hex'), hash.toString('hex')].join('$');
}

export async function verifyPassword(password, stored) {
	if (typeof stored !== 'string') return false;
	const [algo, N, r, p, saltHex, hashHex] = stored.split('$');
	if (algo !== 'scrypt' || !saltHex || !hashHex) return false;
	const expected = Buffer.from(hashHex, 'hex');
	const actual = await scrypt(String(password).normalize('NFKC'), Buffer.from(saltHex, 'hex'), expected.length, {
		N: Number(N),
		r: Number(r),
		p: Number(p),
		maxmem: 64 * 1024 * 1024
	});
	return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** A dummy hash used to keep login timing constant when the email does not exist. */
export const DUMMY_HASH =
	'scrypt$16384$8$1$00000000000000000000000000000000$' + '0'.repeat(128);
