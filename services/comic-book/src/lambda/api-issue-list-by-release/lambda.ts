import { api } from '@mouseion/functions';
import {
	integer,
	isoDate,
	minLength,
	minValue,
	number,
	object,
	optional,
	string,
	transform,
} from 'valibot';
import { datetimeExists, urlHandle } from '@mouseion/schemas';
import { comicBookReleaseCursor } from '@mouseion/entities';

export const lambda = api({
	schema: {
		pathParameters: object({
			publisher: string([urlHandle()]),
			release: string([isoDate(), datetimeExists()]),
		}),
		queryStringParameters: object({
			cursor: optional(string([comicBookReleaseCursor()])),
			limit: optional(
				transform(
					string([minLength(1)]),
					(input) => Number(input),
					number([integer(), minValue(1)]),
				),
				'10',
			),
		}),
	},
});
