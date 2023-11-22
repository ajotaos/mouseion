import { api } from '@mouseion/functions';
import {
	integer,
	minLength,
	minValue,
	number,
	object,
	optional,
	string,
	transform,
} from 'valibot';
import { comicBookPublisherGsi1Cursor } from '@mouseion/entities';

export const lambda = api({
	schema: {
		queryStringParameters: transform(
			object({
				cursor: optional(string([comicBookPublisherGsi1Cursor()])),
				limit: optional(
					transform(
						string([minLength(1)]),
						(input) => Number(input),
						number([integer(), minValue(1)]),
					),
					'10',
				),
			}),
			(value) => ({ filter: 'all' as const, ...value }),
		),
	},
});
