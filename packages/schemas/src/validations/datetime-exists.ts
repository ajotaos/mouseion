import { getOutput, getPipeIssues, type ErrorMessage } from 'valibot';

export function datetimeExists<TInput extends string>(error?: ErrorMessage) {
	return (input: TInput) => {
		if (isNaN(new Date(input).valueOf())) {
			return getPipeIssues(
				'datetime_exists',
				error ?? 'Datetime does not exist',
				input,
			);
		}

		return getOutput(input);
	};
}
