import { type comicBookRelease } from '@mouseion/entities';

export type CreateReleaseProps = {
	readonly date: string;
	readonly publisher: string;
};

export type CreateReleaseDependencies = {
	readonly entities: {
		readonly comicBook: {
			readonly release: ReturnType<typeof comicBookRelease>;
		};
	};
};

export async function createRelease(
	props: CreateReleaseProps,
	dependencies: CreateReleaseDependencies,
) {
	const release = {
		date: props.date,
		publisher: props.publisher,
		createdAt: new Date().toISOString(),
	};

	await dependencies.entities.comicBook.release.create(release);

	return { release };
}
