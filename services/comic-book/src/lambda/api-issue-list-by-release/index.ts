import { listIssuesByRelease } from '../../app/list-issues-by-release';

import { comicBookIssue } from '@mouseion/entities';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { env } from './env';
import { lambda } from './lambda';

const dynamodb = DynamoDBDocumentClient.from(
	new DynamoDBClient({ region: env.awsRegion }),
);
const entities = {
	comicBook: {
		issue: comicBookIssue(dynamodb, env.dynamodbTableName),
	},
};

export const main = lambda.handler(async (event) => {
	const { issues, cursor } = await listIssuesByRelease(
		{
			publisher: event.pathParameters.publisher,
			release: event.pathParameters.release,
			cursor: event.queryStringParameters.cursor,
			limit: event.queryStringParameters.limit,
		},
		{ entities },
	);

	return {
		statusCode: 200,
		body: {
			issues,
			cursor: cursor ?? null,
		},
	};
});
