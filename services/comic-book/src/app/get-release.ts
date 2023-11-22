import { type comicBookRelease } from '@mouseion/entities';

export type GetReleaseProps = {
	readonly date: string;
	readonly publisher: string;
};

export type GetReleaseDependencies = {
	readonly entities: {
		readonly comicBook: {
			readonly release: ReturnType<typeof comicBookRelease>;
		};
	};
};

export async function getRelease(
	props: GetReleaseProps,
	dependencies: GetReleaseDependencies,
) {
	const { item } = await dependencies.entities.comicBook.release.get(props);

	return { release: item };
}
