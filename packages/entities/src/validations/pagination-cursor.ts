import { getOutput, getPipeIssues, type ErrorMessage } from 'valibot';

export function paginationCursor<TInput extends string>(
	decoder: (input: TInput) => unknown,
	error?: ErrorMessage,
) {
	return (input: TInput) => {
		try {
			decoder(input);
			return getOutput(input);
		} catch {
			return getPipeIssues(
				'pagination_cursor',
				error ?? 'Invalid pagination cursor',
				input,
			);
		}
	};
}
