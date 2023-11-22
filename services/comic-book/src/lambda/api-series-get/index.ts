import { getSeries } from '../../app/get-series';

import { comicBookSeries } from '@mouseion/entities';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { env } from './env';
import { lambda } from './lambda';

import { createError } from '@middy/util';

const dynamodb = DynamoDBDocumentClient.from(
	new DynamoDBClient({ region: env.awsRegion }),
);
const entities = {
	comicBook: {
		series: comicBookSeries(dynamodb, env.dynamodbTableName),
	},
};

export const main = lambda.handler(async (event) => {
	const { series } = await getSeries(
		{
			handle: event.pathParameters.handle,
			publisher: event.pathParameters.publisher,
		},
		{ entities },
	);

	if (series === undefined) {
		throw createError(404, JSON.stringify({ cause: 'not-found' }));
	}

	return {
		statusCode: 200,
		body: {
			series,
		},
	};
});
