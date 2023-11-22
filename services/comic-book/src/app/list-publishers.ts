import { type comicBookPublisher } from '@mouseion/entities';

export type ListPublishersProps = {
	readonly cursor?: string | undefined;
	readonly limit?: number | undefined;
};

export type ListPublishersDependencies = {
	readonly entities: {
		readonly comicBook: {
			readonly publisher: ReturnType<typeof comicBookPublisher>;
		};
	};
};

export async function listPublishers(
	props: ListPublishersProps,
	dependencies: ListPublishersDependencies,
) {
	const { items, cursor } =
		await dependencies.entities.comicBook.publisher.list(props);

	return { publishers: items, cursor };
}
