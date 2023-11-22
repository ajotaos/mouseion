import { api } from '@mouseion/functions';
import { minLength, object, string, toTrimmed } from 'valibot';

export const lambda = api({
	bodyParser: 'json',
	schema: {
		body: object({
			title: string([toTrimmed(), minLength(1)]),
		}),
	},
});
