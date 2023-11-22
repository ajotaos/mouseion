import { CustomError } from 'ts-custom-error';

export class DuplicateItemError extends CustomError {
	public constructor(
		public readonly service: string,
		public readonly entity: string,
		public readonly attributes: Record<string, unknown>,
	) {
		super('The provided item already exists', { cause: 'duplicate-item' });
		// Set name explicitly as minification can mangle class names
		Object.defineProperty(this, 'name', { value: 'DuplicateItemError' });
	}
}
