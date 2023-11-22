import {
	parse,
	transform,
	type ObjectSchema,
	type StringSchema,
} from 'valibot';
import { camelKeys } from 'string-ts';

export function parseEnvVariables<
	TSchema extends ObjectSchema<Record<string, StringSchema>>,
>(schema: TSchema, processEnv: NodeJS.ProcessEnv = process.env) {
	return parse(transform(schema, camelKeys), processEnv);
}
