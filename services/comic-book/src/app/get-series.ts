import { type comicBookSeries } from '@mouseion/entities';

export type GetSeriesProps = {
	readonly handle: string;
	readonly publisher: string;
};

export type GetSeriesDependencies = {
	readonly entities: {
		readonly comicBook: {
			readonly series: ReturnType<typeof comicBookSeries>;
		};
	};
};

export async function getSeries(
	props: GetSeriesProps,
	dependencies: GetSeriesDependencies,
) {
	const { item } = await dependencies.entities.comicBook.series.get(props);

	return { series: item };
}
