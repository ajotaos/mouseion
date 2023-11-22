import { listReleasesByPublisher } from '../../app/list-releases-by-publisher';

import { comicBookRelease } from '@mouseion/entities';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { env } from './env';
import { lambda } from './lambda';

const dynamodb = DynamoDBDocumentClient.from(
	new DynamoDBClient({ region: env.awsRegion }),
);
const entities = {
	comicBook: {
		release: comicBookRelease(dynamodb, env.dynamodbTableName),
	},
};

export const main = lambda.handler(async (event) => {
	const { releases, cursor } = await listReleasesByPublisher(
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
			releases,
			cursor: cursor ?? null,
		},
	};
});
