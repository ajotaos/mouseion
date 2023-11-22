import { type comicBookIssue } from '@mouseion/entities';

import { toUrlHandle } from './utils/url-handle';

export type CreateIssueProps = {
	readonly title: string;
	readonly series: string;
	readonly release: string;
	readonly publisher: string;
};

export type CreateIssueDependencies = {
	readonly entities: {
		readonly comicBook: {
			readonly issue: ReturnType<typeof comicBookIssue>;
		};
	};
};

export async function createIssue(
	props: CreateIssueProps,
	dependencies: CreateIssueDependencies,
) {
	const issue = {
		title: props.title,
		handle: toUrlHandle(props.title),
		series: props.series,
		release: props.release,
		publisher: props.publisher,
		createdAt: new Date().toISOString(),
	};

	await dependencies.entities.comicBook.issue.create(issue);

	return { issue };
}
