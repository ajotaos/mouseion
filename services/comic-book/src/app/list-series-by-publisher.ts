import { type comicBookSeries } from '@mouseion/entities';

export type ListSeriessProps = {
	readonly publisher: string;
	readonly cursor?: string | undefined;
	readonly limit?: number | undefined;
};

export type ListSeriessDependencies = {
	readonly entities: {
		readonly comicBook: {
			readonly series: ReturnType<typeof comicBookSeries>;
		};
	};
};

export async function listSeriesByPublisher(
	props: ListSeriessProps,
	dependencies: ListSeriessDependencies,
) {
	const { items, cursor } =
		await dependencies.entities.comicBook.series.listByPublisher(props);

	return { series: items, cursor };
}
