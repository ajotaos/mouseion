import middy, { type MiddyfiedHandler } from '@middy/core';
import httpContentEncoding from '@middy/http-content-encoding';
import httpContentNegotiation from '@middy/http-content-negotiation';
import httpCors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import httpSecurityHeaders from '@middy/http-security-headers';

import {
	httpRequestValidator,
	type Options as HTTPRequestValidatorOptions,
} from './middlewares/http-request-validator';
import { type BaseSchema, type Output } from 'valibot';
import { type APIGatewayEvent } from 'aws-lambda';

export type BodyParser = 'json';

export type Options<
	TBodySchema extends BaseSchema<Record<string, unknown>>,
	TPathParametersSchema extends BaseSchema<Record<string, unknown>>,
	TQueryStringParameters extends BaseSchema<Record<string, unknown>>,
> = {
	readonly schema?: HTTPRequestValidatorOptions<
		TBodySchema,
		TPathParametersSchema,
		TQueryStringParameters
	>;
	readonly bodyParser?: BodyParser;
};

export type Event<
	TBodySchema extends BaseSchema<Record<string, unknown>>,
	TPathParametersSchema extends BaseSchema<Record<string, unknown>>,
	TQueryStringParameters extends BaseSchema<Record<string, unknown>>,
> = Omit<
	APIGatewayEvent,
	'body' | 'pathParameters' | 'queryStringParameters'
> & {
	readonly body: Output<TBodySchema>;
	readonly pathParameters: Output<TPathParametersSchema>;
	readonly queryStringParameters: Output<TQueryStringParameters>;
};

export function api<
	TBodySchema extends BaseSchema<Record<string, unknown>>,
	TPathParametersSchema extends BaseSchema<Record<string, unknown>>,
	TQueryStringParameters extends BaseSchema<Record<string, unknown>>,
>(
	options?: Options<TBodySchema, TPathParametersSchema, TQueryStringParameters>,
): MiddyfiedHandler<
	Event<TBodySchema, TPathParametersSchema, TQueryStringParameters>
> {
	let middyfier = middy()
		.use(httpEventNormalizer())
		.use(httpHeaderNormalizer())
		.use(
			httpContentNegotiation({
				parseCharsets: false,
				parseEncodings: false,
				parseLanguages: false,
				availableMediaTypes: ['application/json'],
			}),
		);

	if (options?.bodyParser === 'json') {
		middyfier = middyfier.use(httpJsonBodyParser());
	}

	// @ts-expect-error: Overriding previous typing for the event http body due to conditional parser.
	middyfier = middyfier
		.use(httpSecurityHeaders())
		.use(httpCors())
		.use(httpContentEncoding())
		.use(
			httpResponseSerializer({
				serializers: [
					{
						regex: /^application\/json$/,
						serializer: ({ body }) => JSON.stringify(body),
					},
				],
				defaultContentType: 'application/json',
			}),
		)
		.use(httpRequestValidator(options?.schema ?? {}))
		.use(httpErrorHandler({ fallbackMessage: 'Internal Server Error' }));

	// @ts-expect-error: Overriding previous typing for the schema due to explicit schema provided.
	return middyfier;
}
