import { api } from '@mouseion/functions';
import { object, string } from 'valibot';
import { urlHandle } from '@mouseion/schemas';

export const lambda = api({
	schema: {
		pathParameters: object({
			handle: string([urlHandle()]),
		}),
	},
});
