import { listPublishers } from '../../app/list-publishers';

import { comicBookPublisher } from '@mouseion/entities';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { env } from './env';
import { lambda } from './lambda';

const dynamodb = DynamoDBDocumentClient.from(
	new DynamoDBClient({ region: env.awsRegion }),
);
const entities = {
	comicBook: {
		publisher: comicBookPublisher(dynamodb, env.dynamodbTableName),
	},
};

export const main = lambda.handler(async (event) => {
	const { publishers, cursor } = await listPublishers(
		{
			cursor: event.queryStringParameters.cursor,
			limit: event.queryStringParameters.limit,
		},
		{ entities },
	);

	return {
		statusCode: 200,
		body: {
			publishers,
			cursor: cursor ?? null,
		},
	};
});
