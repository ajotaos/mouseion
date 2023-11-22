import { getOutput, getPipeIssues, type ErrorMessage } from 'valibot';

const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function urlHandle<TInput extends string>(error?: ErrorMessage) {
	return (input: TInput) => {
		if (!pattern.test(input)) {
			return getPipeIssues('url_handle', error ?? 'Invalid URL handle', input);
		}

		return getOutput(input);
	};
}
