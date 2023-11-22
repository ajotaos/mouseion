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
import { comicBookReleaseCursor } from '@mouseion/entities';

export const lambda = api({
	schema: {
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
