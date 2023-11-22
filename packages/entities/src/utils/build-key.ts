import { takeWhile } from './take-while';

export function pk(service: string, ...parts: Array<string>) {
	return `${service}#${parts.map((part) => `${part}:`).join('')}`;
}

export function sk(...parts: Array<string>) {
	return takeWhile(parts, (part) => part.length > 0).join(':');
}
