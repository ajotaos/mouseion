import { createIssue } from '../../app/create-issue';

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
	const { issue } = await createIssue(
		{
			title: event.body.title,
			series: event.body.series,
			release: event.body.release,
			publisher: event.body.publisher,
		},
		{ entities },
	);

	return {
		statusCode: 201,
		body: {
			issue,
		},
	};
});
