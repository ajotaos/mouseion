import {
	seriesCursor,
	seriesPk,
	seriesSk,
	type Series,
} from './entities/series';

import {
	GetCommand,
	PutCommand,
	QueryCommand,
	type DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

import { paginationCursor } from '../validations/pagination-cursor';

import { type PrimaryKey } from '../schemas/table';

import { type ErrorMessage } from 'valibot';

export { type Series } from './entities/series';

export type GetSeriesProps = {
	readonly handle: string;
	readonly publisher: string;
};

export type ListSeriesByPublisherProps = {
	readonly publisher: string;
	readonly cursor?: string | undefined;
	readonly limit?: number | undefined;
};

export type CreateSeriesProps = {
	readonly title: string;
	readonly handle: string;
	readonly release: string;
	readonly publisher: string;
	readonly createdAt: string;
};

export function comicBookSeries(
	client: DynamoDBDocumentClient,
	tableName: string,
) {
	return {
		async get(props: GetSeriesProps) {
			const command = new GetCommand({
				/* eslint-disable @typescript-eslint/naming-convention */
				TableName: tableName,
				Key: {
					pk: seriesPk(props),
					sk: seriesSk(props),
				},
				ExpressionAttributeNames: {
					'#title': 'title',
					'#handle': 'handle',
					'#release': 'release',
					'#publisher': 'publisher',
					'#createdAt': 'createdAt',
				},
				ProjectionExpression: '#title,#handle,#release,#publisher,#createdAt',
				/* eslint-enable @typescript-eslint/naming-convention */
			});

			const result = await client.send(command);

			return {
				item: result.Item as Series | undefined,
			};
		},
		async listByPublisher(props: ListSeriesByPublisherProps) {
			const command = new QueryCommand({
				/* eslint-disable @typescript-eslint/naming-convention */
				TableName: tableName,
				ExpressionAttributeNames: {
					'#pk': 'pk',
					'#sk': 'sk',
					'#title': 'title',
					'#handle': 'handle',
					'#release': 'release',
					'#publisher': 'publisher',
					'#createdAt': 'createdAt',
				},
				ExpressionAttributeValues: {
					':pk': seriesPk({ publisher: props.publisher }),
					':sk_prefix': seriesSk({ handle: '' }),
				},
				KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk_prefix)',
				ExclusiveStartKey: seriesCursor.decode(props.cursor) as PrimaryKey,
				// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
				Limit: props.limit as number,
				ProjectionExpression: '#title,#handle,#release,#publisher,#createdAt',
				/* eslint-enable @typescript-eslint/naming-convention */
			});

			const result = await client.send(command);

			return {
				items: result.Items as Array<Series>,
				cursor: seriesCursor.encode(result.LastEvaluatedKey as PrimaryKey),
			};
		},
		async create(props: CreateSeriesProps) {
			const command = new PutCommand({
				/* eslint-disable @typescript-eslint/naming-convention */
				TableName: tableName,
				Item: {
					pk: seriesPk(props),
					sk: seriesSk(props),
					title: props.title,
					handle: props.handle,
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

export function comicBookSeriesCursor(error?: ErrorMessage) {
	return paginationCursor(seriesCursor.decode, error);
}
