import { type comicBookPublisher } from '@mouseion/entities';

export type GetPublisherProps = {
	readonly handle: string;
};

export type GetPublisherDependencies = {
	readonly entities: {
		readonly comicBook: {
			readonly publisher: ReturnType<typeof comicBookPublisher>;
		};
	};
};

export async function getPublisher(
	props: GetPublisherProps,
	dependencies: GetPublisherDependencies,
) {
	const { item } = await dependencies.entities.comicBook.publisher.get(props);

	return { publisher: item };
}
