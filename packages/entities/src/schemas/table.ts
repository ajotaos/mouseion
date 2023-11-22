import {
	merge,
	minLength,
	object,
	optional,
	string,
	isoTimestamp,
	type ObjectSchema,
	type Output,
} from 'valibot';
import { datetimeExists } from '@mouseion/schemas';

export const primaryKeySchema = object({
	pk: string([minLength(1)]),
	sk: string([minLength(1)]),
});

export type PrimaryKey = Output<typeof primaryKeySchema>;

export const lifecycleSchema = object({
	createdAt: string([isoTimestamp(), datetimeExists()]),
	lastUpdatedAt: optional(string([isoTimestamp(), datetimeExists()])),
});

export const gsi1KeySchema = merge([
	primaryKeySchema,
	object({
		gsi1pk: string([minLength(1)]),
		gsi1sk: string([minLength(1)]),
	}),
]);

export type Gsi1Key = Output<typeof gsi1KeySchema>;

export function mainTable<TSchema extends ObjectSchema<any>>(schema: TSchema) {
	return merge([primaryKeySchema, schema, lifecycleSchema]);
}

export function gsi1<TSchema extends ObjectSchema<any>>(schema: TSchema) {
	return merge([gsi1KeySchema, schema, lifecycleSchema]);
}
