import { type comicBookSeries } from '@mouseion/entities';

import { toUrlHandle } from './utils/url-handle';

export type CreateSeriesProps = {
	readonly title: string;
	readonly release: string;
	readonly publisher: string;
};

export type CreateSeriesDependencies = {
	readonly entities: {
		readonly comicBook: {
			readonly series: ReturnType<typeof comicBookSeries>;
		};
	};
};

export async function createSeries(
	props: CreateSeriesProps,
	dependencies: CreateSeriesDependencies,
) {
	const series = {
		title: props.title,
		handle: toUrlHandle(props.title),
		release: props.release,
		publisher: props.publisher,
		createdAt: new Date().toISOString(),
	};

	await dependencies.entities.comicBook.series.create(series);

	return { series };
}
