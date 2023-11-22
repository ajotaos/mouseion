import { mainTable, type PrimaryKey } from '../../schemas/table';
import { entity } from '../../schemas/entity';

import { pk, sk } from '../../utils/build-key';

import {
	minLength,
	object,
	pick,
	string,
	toTrimmed,
	type Output,
	isoDate,
} from 'valibot';
import { datetimeExists, urlHandle } from '@mouseion/schemas';

const seriesBaseAttributesSchema = object({
	title: string([toTrimmed(), minLength(1)]),
	handle: string([urlHandle()]),
	release: string([isoDate(), datetimeExists()]),
	publisher: string([urlHandle()]),
});

export const seriesSchema = entity(mainTable(seriesBaseAttributesSchema));
export const seriesPkPropsSchema = pick(seriesSchema, ['publisher']);
export const seriesSkPropsSchema = pick(seriesSchema, ['handle']);

export type Series = Output<typeof seriesSchema>;
export type SeriesPkProps = Output<typeof seriesPkPropsSchema>;
export type SeriesSkProps = Output<typeof seriesSkPropsSchema>;

export function seriesPk(props: SeriesPkProps) {
	return pk('comic-book', 'publisher', props.publisher);
}

export function seriesSk(props: SeriesSkProps) {
	return sk('series', props.handle);
}

const seriesPkPattern =
	/^comic-book#publisher:(?<publisher>[a-z0-9]+(?:-[a-z0-9]+)*):$/;
const seriesSkPattern = /^series:(?<handle>[a-z0-9]+(?:-[a-z0-9]+)*)$/;

export const seriesCursor = {
	encode(primaryKey: PrimaryKey | undefined) {
		if (primaryKey === undefined) {
			return undefined;
		}

		const { publisher } = seriesPkPattern.exec(primaryKey.pk)!
			.groups as SeriesPkProps;
		const { handle } = seriesSkPattern.exec(primaryKey.sk)!
			.groups as SeriesSkProps;

		return Buffer.from(JSON.stringify({ handle, publisher })).toString(
			'base64url',
		);
	},
	decode(cursor: string | undefined) {
		if (cursor === undefined) {
			return undefined;
		}

		const cursorProps = JSON.parse(
			Buffer.from(cursor, 'base64url').toString(),
		) as SeriesPkProps & SeriesSkProps;

		return {
			pk: seriesPk(cursorProps),
			sk: seriesSk(cursorProps),
		};
	},
};
