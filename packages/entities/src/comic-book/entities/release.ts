import {
	gsi1,
	mainTable,
	type Gsi1Key,
	type PrimaryKey,
} from '../../schemas/table';
import { entity } from '../../schemas/entity';

import { pk, sk } from '../../utils/build-key';

import { isoDate, object, pick, string, type Output } from 'valibot';
import { datetimeExists, urlHandle } from '@mouseion/schemas';

const releaseBaseAttributesSchema = object({
	date: string([isoDate(), datetimeExists()]),
	publisher: string([urlHandle()]),
});

export const releaseSchema = entity(mainTable(releaseBaseAttributesSchema));
export const releasePkPropsSchema = pick(releaseSchema, ['publisher']);
export const releaseSkPropsSchema = pick(releaseSchema, ['date']);

export type Release = Output<typeof releaseSchema>;
export type ReleasePkProps = Output<typeof releasePkPropsSchema>;
export type ReleaseSkProps = Output<typeof releaseSkPropsSchema>;

export function releasePk(props: ReleasePkProps) {
	return pk('comic-book', 'publisher', props.publisher);
}

export function releaseSk(props: ReleaseSkProps) {
	return sk('release', props.date);
}

const releasePkPattern =
	/^comic-book#publisher:(?<publisher>[a-z0-9]+(?:-[a-z0-9]+)*):$/;
const releaseSkPattern =
	/^release:(?<date>\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01]))$/;

export const releaseCursor = {
	encode(primaryKey: PrimaryKey | undefined) {
		if (primaryKey === undefined) {
			return undefined;
		}

		const { publisher } = releasePkPattern.exec(primaryKey.pk)!
			.groups as ReleasePkProps;
		const { date } = releaseSkPattern.exec(primaryKey.sk)!
			.groups as ReleaseSkProps;

		return Buffer.from(JSON.stringify({ date, publisher })).toString(
			'base64url',
		);
	},
	decode(cursor: string | undefined) {
		if (cursor === undefined) {
			return undefined;
		}

		const cursorProps = JSON.parse(
			Buffer.from(cursor, 'base64url').toString(),
		) as ReleasePkProps & ReleaseSkProps;

		return {
			pk: releasePk(cursorProps),
			sk: releaseSk(cursorProps),
		};
	},
};

export const releaseGsi1Schema = gsi1(releaseBaseAttributesSchema);
export const releaseGsi1PkPropsSchema = pick(releaseGsi1Schema, []);
export const releaseGsi1SkPropsSchema = pick(releaseGsi1Schema, [
	'date',
	'publisher',
]);

export type ReleaseGsi1 = Output<typeof releaseGsi1Schema>;
export type ReleaseGsi1PkProps = Output<typeof releaseGsi1PkPropsSchema>;
export type ReleaseGsi1SkProps = Output<typeof releaseGsi1SkPropsSchema>;

export function releaseGsi1Pk() {
	return pk('comic-book');
}

export function releaseGsi1Sk(props: ReleaseGsi1SkProps) {
	return sk('release', props.date, 'publisher', props.publisher);
}

const releaseGsi1SkPattern =
	/^release:(?<date>\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])):publisher:(?<publisher>[a-z0-9]+(?:-[a-z0-9]+)*)$/;

export const releaseGsi1Cursor = {
	encode(gsi1Key: Gsi1Key | undefined) {
		if (gsi1Key === undefined) {
			return undefined;
		}

		const { date, publisher } = releaseGsi1SkPattern.exec(gsi1Key.gsi1sk)!
			.groups as ReleaseGsi1SkProps;

		return Buffer.from(JSON.stringify({ date, publisher })).toString(
			'base64url',
		);
	},
	decode(cursor: string | undefined) {
		if (cursor === undefined) {
			return undefined;
		}

		const cursorProps = JSON.parse(
			Buffer.from(cursor, 'base64url').toString(),
		) as ReleasePkProps &
			ReleaseSkProps &
			ReleaseGsi1PkProps &
			ReleaseGsi1SkProps;

		return {
			pk: releasePk(cursorProps),
			sk: releaseSk(cursorProps),
			gsi1pk: releaseGsi1Pk(),
			gsi1sk: releaseGsi1Sk(cursorProps),
		};
	},
};
