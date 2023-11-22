import { getPublisher } from '../../app/get-publisher';

import { comicBookPublisher } from '@mouseion/entities';
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
		publisher: comicBookPublisher(dynamodb, env.dynamodbTableName),
	},
};

export const main = lambda.handler(async (event) => {
	const { publisher } = await getPublisher(
		{ handle: event.pathParameters.handle },
		{ entities },
	);

	if (publisher === undefined) {
		throw createError(404, JSON.stringify({ cause: 'not-found' }));
	}

	return {
		statusCode: 200,
		body: {
			publisher,
		},
	};
});
