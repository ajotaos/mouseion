import { createPublisher } from '../../app/create-publisher';

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
	const { publisher } = await createPublisher(
		{ title: event.body.title },
		{ entities },
	);

	return {
		statusCode: 201,
		body: {
			publisher,
		},
	};
});
