import {
	publisherGsi1Cursor,
	publisherGsi1Pk,
	publisherGsi1Sk,
	publisherPk,
	publisherSk,
	type Publisher,
	type PublisherGsi1,
} from './entities/publisher';

import {
	GetCommand,
	PutCommand,
	QueryCommand,
	type DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

import { paginationCursor } from '../validations/pagination-cursor';

import { type Gsi1Key } from '../schemas/table';

import { type ErrorMessage } from 'valibot';

export { type Publisher, type PublisherGsi1 } from './entities/publisher';

export type GetPublisherProps = {
	readonly handle: string;
};

export type ListPublishersProps = {
	readonly cursor?: string | undefined;
	readonly limit?: number | undefined;
};

export type CreatePublisherProps = {
	readonly title: string;
	readonly handle: string;
	readonly createdAt: string;
};

export function comicBookPublisher(
	client: DynamoDBDocumentClient,
	tableName: string,
) {
	return {
		async get(props: GetPublisherProps) {
			const command = new GetCommand({
				/* eslint-disable @typescript-eslint/naming-convention */
				TableName: tableName,
				Key: {
					pk: publisherPk({ handle: props.handle }),
					sk: publisherSk(),
				},
				ExpressionAttributeNames: {
					'#title': 'title',
					'#handle': 'handle',
					'#createdAt': 'createdAt',
				},
				ProjectionExpression: '#title,#handle,#createdAt',
				/* eslint-enable @typescript-eslint/naming-convention */
			});

			const result = await client.send(command);

			return {
				item: result.Item as Publisher | undefined,
			};
		},
		async list(props: ListPublishersProps) {
			const command = new QueryCommand({
				/* eslint-disable @typescript-eslint/naming-convention */
				TableName: tableName,
				IndexName: 'gsi1',
				ExpressionAttributeNames: {
					'#gsi1pk': 'gsi1pk',
					'#gsi1sk': 'gsi1sk',
					'#title': 'title',
					'#handle': 'handle',
					'#createdAt': 'createdAt',
				},
				ExpressionAttributeValues: {
					':gsi1pk': publisherGsi1Pk(),
					':gsi1sk_prefix': publisherGsi1Sk({ handle: '' }),
				},
				KeyConditionExpression:
					'#gsi1pk = :gsi1pk AND begins_with(#gsi1sk, :gsi1sk_prefix)',
				ExclusiveStartKey: publisherGsi1Cursor.decode(props.cursor) as Gsi1Key,
				// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
				Limit: props.limit as number,
				ProjectionExpression: '#title,#handle,#createdAt',
				/* eslint-enable @typescript-eslint/naming-convention */
			});

			const result = await client.send(command);

			return {
				items: result.Items as Array<PublisherGsi1>,
				cursor: publisherGsi1Cursor.encode(result.LastEvaluatedKey as Gsi1Key),
			};
		},
		async create(props: CreatePublisherProps) {
			const command = new PutCommand({
				/* eslint-disable @typescript-eslint/naming-convention */
				TableName: tableName,
				Item: {
					pk: publisherPk({ handle: props.handle }),
					sk: publisherSk(),
					gsi1pk: publisherGsi1Pk(),
					gsi1sk: publisherGsi1Sk({ handle: props.handle }),
					title: props.title,
					handle: props.handle,
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

export function comicBookPublisherGsi1Cursor(error?: ErrorMessage) {
	return paginationCursor(publisherGsi1Cursor.decode, error);
}
