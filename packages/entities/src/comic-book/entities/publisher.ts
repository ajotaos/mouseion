import {
	gsi1,
	mainTable,
	type Gsi1Key,
	type PrimaryKey,
} from '../../schemas/table';
import { entity } from '../../schemas/entity';

import { pk, sk } from '../../utils/build-key';

import {
	minLength,
	object,
	pick,
	string,
	toTrimmed,
	type Output,
} from 'valibot';
import { urlHandle } from '@mouseion/schemas';

const publisherAttributesSchema = object({
	title: string([toTrimmed(), minLength(1)]),
	handle: string([urlHandle()]),
});

export const publisherSchema = entity(mainTable(publisherAttributesSchema));
export const publisherPkPropsSchema = pick(publisherSchema, ['handle']);
export const publisherSkPropsSchema = pick(publisherSchema, []);

export type Publisher = Output<typeof publisherSchema>;
export type PublisherPkProps = Output<typeof publisherPkPropsSchema>;
export type PublisherSkProps = Output<typeof publisherSkPropsSchema>;

export function publisherPk(props: PublisherPkProps) {
	return pk('comic-book', 'publisher', props.handle);
}

export function publisherSk() {
	return sk('data');
}

const publisherPkPattern =
	/^comic-book#publisher:(?<handle>[a-z0-9]+(?:-[a-z0-9]+)*):$/;

export const publisherCursor = {
	encode(primaryKey: PrimaryKey | undefined) {
		if (primaryKey === undefined) {
			return undefined;
		}

		const { handle } = publisherPkPattern.exec(primaryKey.pk)!
			.groups as PublisherPkProps;

		return Buffer.from(JSON.stringify({ handle })).toString('base64url');
	},
	decode(cursor: string | undefined) {
		if (cursor === undefined) {
			return undefined;
		}

		const cursorProps = JSON.parse(
			Buffer.from(cursor, 'base64url').toString(),
		) as PublisherPkProps & PublisherSkProps;

		return {
			pk: publisherPk(cursorProps),
			sk: publisherSk(),
		};
	},
};

export const publisherGsi1Schema = gsi1(publisherAttributesSchema);
export const publisherGsi1PkPropsSchema = pick(publisherGsi1Schema, []);
export const publisherGsi1SkPropsSchema = pick(publisherGsi1Schema, ['handle']);

export type PublisherGsi1 = Output<typeof publisherGsi1Schema>;
export type PublisherGsi1PkProps = Output<typeof publisherGsi1PkPropsSchema>;
export type PublisherGsi1SkProps = Output<typeof publisherGsi1SkPropsSchema>;

export function publisherGsi1Pk() {
	return pk('comic-book');
}

export function publisherGsi1Sk(props: PublisherGsi1SkProps) {
	return sk('publisher', props.handle);
}

const publisherGsi1SkPattern =
	/^publisher:(?<handle>[a-z0-9]+(?:-[a-z0-9]+)*)$/;

export const publisherGsi1Cursor = {
	encode(gsi1Key: Gsi1Key) {
		if (gsi1Key === undefined) {
			return undefined;
		}

		const { handle } = publisherGsi1SkPattern.exec(gsi1Key.gsi1sk)!
			.groups as PublisherGsi1SkProps;

		return Buffer.from(JSON.stringify({ handle })).toString('base64url');
	},
	decode(cursor: string | undefined) {
		if (cursor === undefined) {
			return undefined;
		}

		const cursorProps = JSON.parse(
			Buffer.from(cursor, 'base64url').toString(),
		) as PublisherPkProps &
			PublisherSkProps &
			PublisherGsi1PkProps &
			PublisherGsi1SkProps;

		return {
			pk: publisherPk(cursorProps),
			sk: publisherSk(),
			gsi1pk: publisherGsi1Pk(),
			gsi1sk: publisherGsi1Sk(cursorProps),
		};
	},
};
