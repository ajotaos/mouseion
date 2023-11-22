import { type StackContext, Table } from 'sst/constructs';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Dynamodb({ stack }: StackContext) {
	const table = new Table(stack, 'Table', {
		fields: {
			pk: 'string',
			sk: 'string',
			gsi1pk: 'string',
			gsi1sk: 'string',
		},
		primaryIndex: { partitionKey: 'pk', sortKey: 'sk' },
		globalIndexes: {
			gsi1: { partitionKey: 'gsi1pk', sortKey: 'gsi1sk' },
		},
	});

	stack.addOutputs({
		/* eslint-disable @typescript-eslint/naming-convention */
		TableName: table.tableName,
		/* eslint-enable @typescript-eslint/naming-convention */
	});

	return { table };
}
