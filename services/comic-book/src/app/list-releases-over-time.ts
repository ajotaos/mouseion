import { type comicBookRelease } from '@mouseion/entities';

export type ListReleasesProps = {
	readonly cursor?: string | undefined;
	readonly limit?: number | undefined;
};

export type ListReleasesDependencies = {
	readonly entities: {
		readonly comicBook: {
			readonly release: ReturnType<typeof comicBookRelease>;
		};
	};
};

export async function listReleasesOverTime(
	props: ListReleasesProps,
	dependencies: ListReleasesDependencies,
) {
	const { items, cursor } =
		await dependencies.entities.comicBook.release.listOverTime(props);

	return { releases: items, cursor };
}
