import { getRelease } from '../../app/get-release';

import { comicBookRelease } from '@mouseion/entities';
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
		release: comicBookRelease(dynamodb, env.dynamodbTableName),
	},
};

export const main = lambda.handler(async (event) => {
	const { release } = await getRelease(
		{
			date: event.pathParameters.date,
			publisher: event.pathParameters.publisher,
		},
		{ entities },
	);

	if (release === undefined) {
		throw createError(404, JSON.stringify({ cause: 'not-found' }));
	}

	return {
		statusCode: 200,
		body: {
			release,
		},
	};
});
