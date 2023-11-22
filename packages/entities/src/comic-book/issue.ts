import {
	issueCursor,
	issueGsi1Cursor,
	issueGsi1Pk,
	issueGsi1Sk,
	issuePk,
	issueSk,
	type Issue,
	type IssueGsi1,
} from './entities/issue';

import {
	GetCommand,
	PutCommand,
	QueryCommand,
	type DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

import { paginationCursor } from '../validations/pagination-cursor';

import { type PrimaryKey, type Gsi1Key } from '../schemas/table';

import { type ErrorMessage } from 'valibot';

export { type Issue, type IssueGsi1 } from './entities/issue';

export type GetIssueProps = {
	readonly handle: string;
	readonly series: string;
	readonly publisher: string;
};

export type ListIssuesBySeriesProps = {
	readonly publisher: string;
	readonly series: string;
	readonly cursor?: string | undefined;
	readonly limit?: number | undefined;
};

export type ListIssuesByReleaseProps = {
	readonly publisher: string;
	readonly release: string;
	readonly cursor?: string | undefined;
	readonly limit?: number | undefined;
};

export type CreateIssueProps = {
	readonly title: string;
	readonly handle: string;
	readonly series: string;
	readonly release: string;
	readonly publisher: string;
	readonly createdAt: string;
};

export function comicBookIssue(
	client: DynamoDBDocumentClient,
	tableName: string,
) {
	return {
		async get(props: GetIssueProps) {
			const command = new GetCommand({
				/* eslint-disable @typescript-eslint/naming-convention */
				TableName: tableName,
				Key: {
					pk: issuePk({ publisher: props.publisher, series: props.series }),
					sk: issueSk({ handle: props.handle }),
				},
				ExpressionAttributeNames: {
					'#date': 'date',
					'#publisher': 'publisher',
					'#createdAt': 'createdAt',
				},
				ProjectionExpression:
					'#title,#handle,#series,#release,#publisher,#createdAt',
				/* eslint-enable @typescript-eslint/naming-convention */
			});

			const result = await client.send(command);

			return {
				item: result.Item as Issue | undefined,
			};
		},
		async listBySeries(props: ListIssuesBySeriesProps) {
			const command = new QueryCommand({
				/* eslint-disable @typescript-eslint/naming-convention */
				TableName: tableName,
				ExpressionAttributeNames: {
					'#pk': 'pk',
					'#sk': 'sk',
					'#date': 'date',
					'#publisher': 'publisher',
					'#createdAt': 'createdAt',
				},
				ExpressionAttributeValues: {
					':pk': issuePk({ publisher: props.publisher, series: props.series }),
					':sk_prefix': issueSk({ handle: '' }),
				},
				KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk_prefix)',
				ExclusiveStartKey: issueCursor.decode(props.cursor) as PrimaryKey,
				// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
				Limit: props.limit as number,
				ProjectionExpression:
					'#title,#handle,#series,#release,#publisher,#createdAt',
				/* eslint-enable @typescript-eslint/naming-convention */
			});

			const result = await client.send(command);

			return {
				items: result.Items as Array<Issue>,
				cursor: issueCursor.encode(result.LastEvaluatedKey as PrimaryKey),
			};
		},
		async listByRelease(props: ListIssuesByReleaseProps) {
			const command = new QueryCommand({
				/* eslint-disable @typescript-eslint/naming-convention */
				TableName: tableName,
				IndexName: 'gsi1',
				ExpressionAttributeNames: {
					'#gsi1pk': 'gsi1pk',
					'#gsi1sk': 'gsi1sk',
					'#date': 'date',
					'#publisher': 'publisher',
					'#createdAt': 'createdAt',
				},
				ExpressionAttributeValues: {
					':gsi1pk': issueGsi1Pk({
						publisher: props.publisher,
						release: props.release,
					}),
					':gsi1sk_prefix': issueGsi1Sk({ handle: '' }),
				},
				KeyConditionExpression:
					'#gsi1pk = :gsi1pk AND begins_with(#gsi1sk, :gsi1sk_prefix)',
				ExclusiveStartKey: issueGsi1Cursor.decode(props.cursor) as Gsi1Key,
				// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
				Limit: props.limit as number,
				ProjectionExpression:
					'#title,#handle,#series,#release,#publisher,#createdAt',
				/* eslint-enable @typescript-eslint/naming-convention */
			});

			const result = await client.send(command);

			return {
				items: result.Items as Array<IssueGsi1>,
				cursor: issueGsi1Cursor.encode(result.LastEvaluatedKey as Gsi1Key),
			};
		},
		async create(props: CreateIssueProps) {
			const command = new PutCommand({
				/* eslint-disable @typescript-eslint/naming-convention */
				TableName: tableName,
				Item: {
					pk: issuePk({ publisher: props.publisher, series: props.series }),
					sk: issueSk({ handle: props.handle }),
					gsi1pk: issueGsi1Pk({
						publisher: props.publisher,
						release: props.release,
					}),
					gsi1sk: issueGsi1Sk({ handle: props.handle }),
					title: props.title,
					handle: props.handle,
					series: props.series,
					release: props.release,
					publisher: props.publisher,
					createdAt: props.createdAt,
				},
				ExpressionAttributeNames: {
					'#pk': 'pk',
				},
				ConditionExpression: 'attribute_not_exists(#pk)',
				/* eslint-enable @typescript-eslint/naming-convention */
			});

			await client.send(command);
		},
	};
}

export function comicBookIssueCursor(error?: ErrorMessage) {
	return paginationCursor(issueCursor.decode, error);
}

export function comicBookIssueGsi1Cursor(error?: ErrorMessage) {
	return paginationCursor(issueGsi1Cursor.decode, error);
}
