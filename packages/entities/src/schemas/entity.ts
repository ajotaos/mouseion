import { omit, type ObjectSchema, type StringSchema } from 'valibot';

export function entity<
	TSchema extends ObjectSchema<{
		pk: StringSchema;
		sk: StringSchema;
		gsi1pk?: StringSchema;
		gsi1sk?: StringSchema;
		gsi2pk?: StringSchema;
		gsi2sk?: StringSchema;
	}>,
>(schema: TSchema) {
	return omit(schema, ['pk', 'sk', 'gsi1pk', 'gsi1sk', 'gsi2pk', 'gsi2sk']);
}
