import { join } from 'node:path';

export function servicePathFor(service: string) {
	return (...path: Array<string>) => join('services', service, 'src', ...path);
}
