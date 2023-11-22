import { createSeries } from '../../app/create-series';

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
	const { series } = await createSeries(
		{
			title: event.body.title,
			release: event.body.release,
			publisher: event.body.publisher,
		},
		{ entities },
	);

	return {
		statusCode: 201,
		body: {
			series,
		},
	};
});
