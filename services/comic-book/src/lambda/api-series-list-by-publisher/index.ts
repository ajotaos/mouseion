import { listSeriesByPublisher } from '../../app/list-series-by-publisher';

import { comicBookSeries } from '@mouseion/entities';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { env } from './env';
import { lambda } from './lambda';

const dynamodb = DynamoDBDocumentClient.from(
	new DynamoDBClient({ region: env.awsRegion }),
);
const entities = {
	comicBook: {
		series: comicBookSeries(dynamodb, env.dynamodbTableName),
	},
};

export const main = lambda.handler(async (event) => {
	const { series, cursor } = await listSeriesByPublisher(
		{
			publisher: event.pathParameters.publisher,
			cursor: event.queryStringParameters.cursor,
			limit: event.queryStringParameters.limit,
		},
		{ entities },
	);

	return {
		statusCode: 200,
		body: {
			series,
			cursor: cursor ?? null,
		},
	};
});
