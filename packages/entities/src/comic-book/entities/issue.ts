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
	isoDate,
	object,
	pick,
	string,
	toTrimmed,
	type Output,
} from 'valibot';
import { datetimeExists, urlHandle } from '@mouseion/schemas';

const issueBaseAttributesSchema = object({
	title: string([toTrimmed(), minLength(1)]),
	handle: string([urlHandle()]),
	series: string([urlHandle()]),
	release: string([isoDate(), datetimeExists()]),
	publisher: string([urlHandle()]),
});

export const issueSchema = entity(mainTable(issueBaseAttributesSchema));
export const issuePkPropsSchema = pick(issueSchema, ['series', 'publisher']);
export const issueSkPropsSchema = pick(issueSchema, ['handle']);

export type Issue = Output<typeof issueSchema>;
export type IssuePkProps = Output<typeof issuePkPropsSchema>;
export type IssueSkProps = Output<typeof issueSkPropsSchema>;

export function issuePk(props: IssuePkProps) {
	return pk('comic-book', 'publisher', props.publisher, 'series', props.series);
}

export function issueSk(props: IssueSkProps) {
	return sk('issue', props.handle);
}

const issuePkPattern =
	/^comic-book#publisher:(?<publisher>[a-z0-9]+(?:-[a-z0-9]+)*):series:(?<series>[a-z0-9]+(?:-[a-z0-9]+)*):$/;
const issueSkPattern = /^issue:(?<handle>[a-z0-9]+(?:-[a-z0-9]+)*)$/;

export const issueCursor = {
	encode(primaryKey: PrimaryKey | undefined) {
		if (primaryKey === undefined) {
			return undefined;
		}

		const { publisher, series } = issuePkPattern.exec(primaryKey.pk)!
			.groups as IssuePkProps;
		const { handle } = issueSkPattern.exec(primaryKey.sk)!
			.groups as IssueSkProps;

		return Buffer.from(JSON.stringify({ handle, series, publisher })).toString(
			'base64url',
		);
	},
	decode(cursor: string | undefined) {
		if (cursor === undefined) {
			return undefined;
		}

		const cursorProps = JSON.parse(
			Buffer.from(cursor, 'base64url').toString(),
		) as IssuePkProps & IssueSkProps;

		return {
			pk: issuePk(cursorProps),
			sk: issueSk(cursorProps),
		};
	},
};

export const issueGsi1Schema = gsi1(issueBaseAttributesSchema);
export const issueGsi1PkPropsSchema = pick(issueGsi1Schema, [
	'release',
	'publisher',
]);
export const issueGsi1SkPropsSchema = pick(issueGsi1Schema, ['handle']);

export type IssueGsi1 = Output<typeof issueGsi1Schema>;
export type IssueGsi1PkProps = Output<typeof issueGsi1PkPropsSchema>;
export type IssueGsi1SkProps = Output<typeof issueGsi1SkPropsSchema>;

export function issueGsi1Pk(props: IssueGsi1PkProps) {
	return pk(
		'comic-book',
		'publisher',
		props.publisher,
		'release',
		props.release,
	);
}

export function issueGsi1Sk(props: IssueGsi1SkProps) {
	return sk('handle', props.handle);
}

const issueGsi1PkPattern =
	/^comic-book#publisher:(?<publisher>[a-z0-9]+(?:-[a-z0-9]+)*):release:(?<release>\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])):$/;
const issueGsi1SkPattern = /^issue:(?<handle>[a-z0-9]+(?:-[a-z0-9]+)*)$/;

export const issueGsi1Cursor = {
	encode(gsi1Key: Gsi1Key | undefined) {
		if (gsi1Key === undefined) {
			return undefined;
		}

		const { release, publisher } = issueGsi1PkPattern.exec(gsi1Key.gsi1pk)!
			.groups as IssueGsi1PkProps;
		const { handle } = issueGsi1SkPattern.exec(gsi1Key.gsi1sk)!
			.groups as IssueGsi1SkProps;

		return Buffer.from(JSON.stringify({ handle, release, publisher })).toString(
			'base64url',
		);
	},
	decode(cursor: string | undefined) {
		if (cursor === undefined) {
			return undefined;
		}

		const cursorProps = JSON.parse(
			Buffer.from(cursor, 'base64url').toString(),
		) as IssuePkProps & IssueSkProps & IssueGsi1PkProps & IssueGsi1SkProps;

		return {
			pk: issuePk(cursorProps),
			sk: issueSk(cursorProps),
			gsi1pk: issueGsi1Pk(cursorProps),
			gsi1sk: issueGsi1Sk(cursorProps),
		};
	},
};
