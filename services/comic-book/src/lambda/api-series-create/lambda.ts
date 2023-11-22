import { api } from '@mouseion/functions';
import { isoDate, minLength, object, string, toTrimmed } from 'valibot';
import { datetimeExists, urlHandle } from '@mouseion/schemas';

export const lambda = api({
	bodyParser: 'json',
	schema: {
		body: object({
			title: string([toTrimmed(), minLength(1)]),
			series: string([urlHandle()]),
			release: string([isoDate(), datetimeExists()]),
			publisher: string([urlHandle()]),
		}),
	},
});
