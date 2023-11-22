import { api } from '@mouseion/functions';
import { isoDate, object, string } from 'valibot';
import { datetimeExists, urlHandle } from '@mouseion/schemas';

export const lambda = api({
	bodyParser: 'json',
	schema: {
		body: object({
			date: string([isoDate(), datetimeExists()]),
			publisher: string([urlHandle()]),
		}),
	},
});
