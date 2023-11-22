import { type comicBookIssue } from '@mouseion/entities';

export type ListIssuesProps = {
	readonly publisher: string;
	readonly series: string;
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

export async function listIssuesBySeries(
	props: ListIssuesProps,
	dependencies: ListIssuesDependencies,
) {
	const { items, cursor } =
		await dependencies.entities.comicBook.issue.listBySeries(props);

	return { issues: items, cursor };
}
