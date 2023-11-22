import { servicePathFor } from './utils/service-path';

import { Dynamodb } from '../dynamodb';

import { type StackContext, use, Api, Function } from 'sst/constructs';

const servicePath = servicePathFor('comic-book');

// eslint-disable-next-line @typescript-eslint/naming-convention
export function ComicBookService({ stack }: StackContext) {
	const { table } = use(Dynamodb);

	const listPublishersApiFn = new Function(stack, 'ListPublishersApiFn', {
		handler: servicePath('lambda', 'api-publisher-list', 'index.main'),
		environment: {
			/* eslint-disable @typescript-eslint/naming-convention */
			DYNAMODB_TABLE_NAME: table.tableName,
			/* eslint-enable @typescript-eslint/naming-convention */
		},
		runtime: 'nodejs18.x',
		logRetention: 'one_week',
	});
	table.cdk.table.grantReadData(listPublishersApiFn);

	const getPublisherApiFn = new Function(stack, 'GetPublisherApiFn', {
		handler: servicePath('lambda', 'api-publisher-get', 'index.main'),
		environment: {
			/* eslint-disable @typescript-eslint/naming-convention */
			DYNAMODB_TABLE_NAME: table.tableName,
			/* eslint-enable @typescript-eslint/naming-convention */
		},
		runtime: 'nodejs18.x',
		logRetention: 'one_week',
	});
	table.cdk.table.grantReadData(getPublisherApiFn);

	const createPublisherApiFn = new Function(stack, 'CreatePublisherApiFn', {
		handler: servicePath('lambda', 'api-publisher-create', 'index.main'),
		environment: {
			/* eslint-disable @typescript-eslint/naming-convention */
			DYNAMODB_TABLE_NAME: table.tableName,
			/* eslint-enable @typescript-eslint/naming-convention */
		},
		runtime: 'nodejs18.x',
		logRetention: 'one_week',
	});
	table.cdk.table.grantWriteData(createPublisherApiFn);

	const listReleasesOverTimeApiFn = new Function(
		stack,
		'ListReleasesOverTimeApiFn',
		{
			handler: servicePath(
				'lambda',
				'api-release-list-over-time',
				'index.main',
			),
			environment: {
				/* eslint-disable @typescript-eslint/naming-convention */
				DYNAMODB_TABLE_NAME: table.tableName,
				/* eslint-enable @typescript-eslint/naming-convention */
			},
			runtime: 'nodejs18.x',
			logRetention: 'one_week',
		},
	);
	table.cdk.table.grantReadData(listReleasesOverTimeApiFn);

	const listReleasesByPublisherApiFn = new Function(
		stack,
		'ListReleasesByPublisherApiFn',
		{
			handler: servicePath(
				'lambda',
				'api-release-list-by-publisher',
				'index.main',
			),
			environment: {
				/* eslint-disable @typescript-eslint/naming-convention */
				DYNAMODB_TABLE_NAME: table.tableName,
				/* eslint-enable @typescript-eslint/naming-convention */
			},
			runtime: 'nodejs18.x',
			logRetention: 'one_week',
		},
	);
	table.cdk.table.grantReadData(listReleasesByPublisherApiFn);

	const getReleaseApiFn = new Function(stack, 'GetReleaseApiFn', {
		handler: servicePath('lambda', 'api-release-get', 'index.main'),
		environment: {
			/* eslint-disable @typescript-eslint/naming-convention */
			DYNAMODB_TABLE_NAME: table.tableName,
			/* eslint-enable @typescript-eslint/naming-convention */
		},
		runtime: 'nodejs18.x',
		logRetention: 'one_week',
	});
	table.cdk.table.grantReadData(getReleaseApiFn);

	const createReleaseApiFn = new Function(stack, 'CreateReleaseApiFn', {
		handler: servicePath('lambda', 'api-release-create', 'index.main'),
		environment: {
			/* eslint-disable @typescript-eslint/naming-convention */
			DYNAMODB_TABLE_NAME: table.tableName,
			/* eslint-enable @typescript-eslint/naming-convention */
		},
		runtime: 'nodejs18.x',
		logRetention: 'one_week',
	});
	table.cdk.table.grantWriteData(createReleaseApiFn);

	const listSeriesByPublisherApiFn = new Function(
		stack,
		'ListSeriesByPublisherApiFn',
		{
			handler: servicePath(
				'lambda',
				'api-series-list-by-publisher',
				'index.main',
			),
			environment: {
				/* eslint-disable @typescript-eslint/naming-convention */
				DYNAMODB_TABLE_NAME: table.tableName,
				/* eslint-enable @typescript-eslint/naming-convention */
			},
			runtime: 'nodejs18.x',
			logRetention: 'one_week',
		},
	);
	table.cdk.table.grantReadData(listSeriesByPublisherApiFn);

	const getSeriesApiFn = new Function(stack, 'GetSeriesApiFn', {
		handler: servicePath('lambda', 'api-series-get', 'index.main'),
		environment: {
			/* eslint-disable @typescript-eslint/naming-convention */
			DYNAMODB_TABLE_NAME: table.tableName,
			/* eslint-enable @typescript-eslint/naming-convention */
		},
		runtime: 'nodejs18.x',
		logRetention: 'one_week',
	});
	table.cdk.table.grantReadData(getSeriesApiFn);

	const createSeriesApiFn = new Function(stack, 'CreateSeriesApiFn', {
		handler: servicePath('lambda', 'api-series-create', 'index.main'),
		environment: {
			/* eslint-disable @typescript-eslint/naming-convention */
			DYNAMODB_TABLE_NAME: table.tableName,
			/* eslint-enable @typescript-eslint/naming-convention */
		},
		runtime: 'nodejs18.x',
		logRetention: 'one_week',
	});
	table.cdk.table.grantWriteData(createSeriesApiFn);

	const listIssuesByPublisherApiFn = new Function(
		stack,
		'ListIssuesByPublisherApiFn',
		{
			handler: servicePath(
				'lambda',
				'api-issue-list-by-publisher',
				'index.main',
			),
			environment: {
				/* eslint-disable @typescript-eslint/naming-convention */
				DYNAMODB_TABLE_NAME: table.tableName,
				/* eslint-enable @typescript-eslint/naming-convention */
			},
			runtime: 'nodejs18.x',
			logRetention: 'one_week',
		},
	);
	table.cdk.table.grantReadData(listIssuesByPublisherApiFn);

	const listIssuesByReleaseApiFn = new Function(
		stack,
		'ListIssuesByReleaseApiFn',
		{
			handler: servicePath('lambda', 'api-issue-list-by-release', 'index.main'),
			environment: {
				/* eslint-disable @typescript-eslint/naming-convention */
				DYNAMODB_TABLE_NAME: table.tableName,
				/* eslint-enable @typescript-eslint/naming-convention */
			},
			runtime: 'nodejs18.x',
			logRetention: 'one_week',
		},
	);
	table.cdk.table.grantReadData(listIssuesByReleaseApiFn);

	const getIssueApiFn = new Function(stack, 'GetIssueApiFn', {
		handler: servicePath('lambda', 'api-issue-get', 'index.main'),
		environment: {
			/* eslint-disable @typescript-eslint/naming-convention */
			DYNAMODB_TABLE_NAME: table.tableName,
			/* eslint-enable @typescript-eslint/naming-convention */
		},
		runtime: 'nodejs18.x',
		logRetention: 'one_week',
	});
	table.cdk.table.grantReadData(getIssueApiFn);

	const createIssueApiFn = new Function(stack, 'CreateIssueApiFn', {
		handler: servicePath('lambda', 'api-issue-create', 'index.main'),
		environment: {
			/* eslint-disable @typescript-eslint/naming-convention */
			DYNAMODB_TABLE_NAME: table.tableName,
			/* eslint-enable @typescript-eslint/naming-convention */
		},
		runtime: 'nodejs18.x',
		logRetention: 'one_week',
	});
	table.cdk.table.grantWriteData(createIssueApiFn);

	const api = new Api(stack, 'Api', {
		routes: {
			/* eslint-disable @typescript-eslint/naming-convention */
			'GET /publishers': listPublishersApiFn,
			'GET /publishers/{handle}': getPublisherApiFn,
			'POST /publishers': createPublisherApiFn,

			'GET /releases': listReleasesOverTimeApiFn,

			'GET /publishers/{publisher}/releases': listReleasesByPublisherApiFn,
			'GET /publishers/{publisher}/releases/{date}': getReleaseApiFn,
			'POST /publishers/{publisher}/releases': createReleaseApiFn,

			'GET /publishers/{publisher}/series': listSeriesByPublisherApiFn,
			'GET /publishers/{publisher}/series/{handle}': getSeriesApiFn,
			'POST /publishers/{publisher}/series': createSeriesApiFn,

			'GET /publishers/{publisher}/series/{series}/issues':
				listIssuesByPublisherApiFn,
			'GET /publishers/{publisher}/releases/{release}/issues':
				listIssuesByReleaseApiFn,
			'GET /publishers/{publisher}/series/{series}/issues/{handle}':
				getSeriesApiFn,
			'POST /publishers/{publisher}/series/{series}/issues': createSeriesApiFn,
			/* eslint-enable @typescript-eslint/naming-convention */
		},
	});

	stack.addOutputs({
		/* eslint-disable @typescript-eslint/naming-convention */
		ApiUrl: api.url,
		/* eslint-enable @typescript-eslint/naming-convention */
	});

	return { api };
}
