import { getIssue } from '../../app/get-issue';

import { comicBookIssue } from '@mouseion/entities';
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
		issue: comicBookIssue(dynamodb, env.dynamodbTableName),
	},
};

export const main = lambda.handler(async (event) => {
	const { issue } = await getIssue(
		{
			handle: event.pathParameters.handle,
			series: event.pathParameters.series,
			publisher: event.pathParameters.publisher,
		},
		{ entities },
	);

	if (issue === undefined) {
		throw createError(404, JSON.stringify({ cause: 'not-found' }));
	}

	return {
		statusCode: 200,
		body: {
			issue,
		},
	};
});
