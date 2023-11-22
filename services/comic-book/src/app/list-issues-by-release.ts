import { type comicBookIssue } from '@mouseion/entities';

export type ListIssuesProps = {
	readonly publisher: string;
	readonly release: string;
	readonly cursor?: string | undefined;
	readonly limit?: number | undefined;
};

export type ListIssuesDependencies = {
	readonly entities: {
		readonly comicBook: {
			readonly issue: ReturnType<typeof comicBookIssue>;
		};
	};
};

export async function listIssuesByRelease(
	props: ListIssuesProps,
	dependencies: ListIssuesDependencies,
) {
	const { items, cursor } =
		await dependencies.entities.comicBook.issue.listByRelease(props);

	return { issues: items, cursor };
}
