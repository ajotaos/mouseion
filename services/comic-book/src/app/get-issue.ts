import { type comicBookIssue } from '@mouseion/entities';

export type GetIssueProps = {
	readonly handle: string;
	readonly series: string;
	readonly publisher: string;
};

export type GetIssueDependencies = {
	readonly entities: {
		readonly comicBook: {
			readonly issue: ReturnType<typeof comicBookIssue>;
		};
	};
};

export async function getIssue(
	props: GetIssueProps,
	dependencies: GetIssueDependencies,
) {
	const { item } = await dependencies.entities.comicBook.issue.get(props);

	return { issue: item };
}
