export function toUrlHandle(input: string) {
	return input
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]/g, '');
}
