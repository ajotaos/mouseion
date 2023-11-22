import { type MiddlewareObj } from '@middy/core';
import { createError } from '@middy/util';

import { safeParse, type BaseSchema, type Output } from 'valibot';

export type Options<
	TBodySchema extends BaseSchema<Record<string, unknown>>,
	TPathParametersSchema extends BaseSchema<Record<string, unknown>>,
	TQueryStringParameters extends BaseSchema<Record<string, unknown>>,
> = {
	readonly body?: TBodySchema;
	readonly pathParameters?: TPathParametersSchema;
	readonly queryStringParameters?: TQueryStringParameters;
};

export function httpRequestValidator<
	TBodySchema extends BaseSchema<Record<string, unknown>>,
	TPathParametersSchema extends BaseSchema<Record<string, unknown>>,
	TQueryStringParameters extends BaseSchema<Record<string, unknown>>,
>(
	options: Options<TBodySchema, TPathParametersSchema, TQueryStringParameters>,
): MiddlewareObj<{
	body: Output<TBodySchema>;
	pathParameters: Output<TPathParametersSchema>;
	queryStringParameters: Output<TQueryStringParameters>;
}> {
	return {
		before(request) {
			if (options.pathParameters !== undefined) {
				request.event.pathParameters = parse(
					options.pathParameters,
					request.event.pathParameters,
				);
			}

			if (options.queryStringParameters !== undefined) {
				request.event.queryStringParameters = parse(
					options.queryStringParameters,
					request.event.queryStringParameters,
				);
			}

			if (options.body !== undefined) {
				request.event.body = parse(options.body, request.event.body);
			}
		},
	};
}

function parse<TSchema extends BaseSchema<Record<string, unknown>>>(
	schema: TSchema,
	input: unknown,
): Output<TSchema> {
	const parsed = safeParse(schema, input, {
		abortPipeEarly: true,
	});
	if (!parsed.success) {
		throw createError(
			400,
			JSON.stringify({
				cause: 'bad-request',
				issues: parsed.issues,
			}),
		);
	}

	return parsed.output;
}
