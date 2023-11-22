import { type comicBookPublisher } from '@mouseion/entities';

import { toUrlHandle } from './utils/url-handle';

export type CreatePublisherProps = {
	readonly title: string;
};

export type CreatePublisherDependencies = {
	readonly entities: {
		readonly comicBook: {
			readonly publisher: ReturnType<typeof comicBookPublisher>;
		};
	};
};

export async function createPublisher(
	props: CreatePublisherProps,
	dependencies: CreatePublisherDependencies,
) {
	const publisher = {
		title: props.title,
		handle: toUrlHandle(props.title),
		createdAt: new Date().toISOString(),
	};

	await dependencies.entities.comicBook.publisher.create(publisher);

	return { publisher };
}
