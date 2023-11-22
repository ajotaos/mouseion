import { createRelease } from '../../app/create-release';

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
	const { release } = await createRelease(
		{ date: event.body.date, publisher: event.body.publisher },
		{ entities },
	);

	return {
		statusCode: 201,
		body: {
			release,
		},
	};
});
