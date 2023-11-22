import {
	releaseCursor,
	releaseGsi1Cursor,
	releaseGsi1Pk,
	releaseGsi1Sk,
	releasePk,
	releaseSk,
	type Release,
	type ReleaseGsi1,
} from './entities/release';

import {
	GetCommand,
	PutCommand,
	QueryCommand,
	type DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

import { paginationCursor } from '../validations/pagination-cursor';

import { type PrimaryKey, type Gsi1Key } from '../schemas/table';

import { type ErrorMessage } from 'valibot';

export { type Release, type ReleaseGsi1 } from './entities/release';

export type GetReleaseProps = {
	readonly date: string;
	readonly publisher: string;
};

export type ListReleasesByPublisherProps = {
	readonly publisher: string;
	readonly cursor?: string | undefined;
	readonly limit?: number | undefined;
};

export type ListReleasesOverTimeProps = {
	readonly cursor?: string | undefined;
	readonly limit?: number | undefined;
};

export type CreateReleaseProps = {
	readonly date: string;
	readonly publisher: string;
	readonly createdAt: string;
};

export function comicBookRelease(
	client: DynamoDBDocumentClient,
	tableName: string,
) {
	return {
		async get(props: GetReleaseProps) {
			const command = new GetCommand({
				/* eslint-disable @typescript-eslint/naming-convention */
				TableName: tableName,
				Key: {
					pk: releasePk({ publisher: props.publisher }),
					sk: releaseSk({ date: props.date }),
				},
				ExpressionAttributeNames: {
					'#date': 'date',
					'#publisher': 'publisher',
					'#createdAt': 'createdAt',
				},
				ProjectionExpression: '#date,#publisher,#createdAt',
				/* eslint-enable @typescript-eslint/naming-convention */
			});

			const result = await client.send(command);

			return {
				item: result.Item as Release | undefined,
			};
		},
		async listByPublisher(props: ListReleasesByPublisherProps) {
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
					':pk': releasePk({ publisher: props.publisher }),
					':sk_prefix': releaseSk({ date: '' }),
				},
				KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk_prefix)',
				ExclusiveStartKey: releaseCursor.decode(props.cursor) as PrimaryKey,
				// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
				Limit: props.limit as number,
				ProjectionExpression: '#date,#publisher,#createdAt',
				/* eslint-enable @typescript-eslint/naming-convention */
			});

			const result = await client.send(command);

			return {
				items: result.Items as Array<Release>,
				cursor: releaseCursor.encode(result.LastEvaluatedKey as PrimaryKey),
			};
		},
		async listOverTime(props: ListReleasesOverTimeProps) {
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
					':gsi1pk': releaseGsi1Pk(),
					':gsi1sk_prefix': releaseGsi1Sk({
						date: '',
						publisher: '',
					}),
				},
				KeyConditionExpression:
					'#gsi1pk = :gsi1pk AND begins_with(#gsi1sk, :gsi1sk_prefix)',
				ExclusiveStartKey: releaseGsi1Cursor.decode(props.cursor) as Gsi1Key,
				// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
				Limit: props.limit as number,
				ScanIndexForward: false,
				ProjectionExpression: '#date,#publisher,#createdAt',
				/* eslint-enable @typescript-eslint/naming-convention */
			});

			const result = await client.send(command);

			return {
				items: result.Items as Array<ReleaseGsi1>,
				cursor: releaseGsi1Cursor.encode(result.LastEvaluatedKey as Gsi1Key),
			};
		},
		async create(props: CreateReleaseProps) {
			const command = new PutCommand({
				/* eslint-disable @typescript-eslint/naming-convention */
				TableName: tableName,
				Item: {
					pk: releasePk({ publisher: props.publisher }),
					sk: releaseSk({ date: props.date }),
					gsi1pk: releaseGsi1Pk(),
					gsi1sk: releaseGsi1Sk({
						publisher: props.publisher,
						date: props.date,
					}),
					date: props.date,
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

export function comicBookReleaseCursor(error?: ErrorMessage) {
	return paginationCursor(releaseCursor.decode, error);
}

export function comicBookReleaseGsi1Cursor(error?: ErrorMessage) {
	return paginationCursor(releaseGsi1Cursor.decode, error);
}
