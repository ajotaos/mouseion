import { parseEnvVariables } from '@mouseion/env';

import { minLength, object, string } from 'valibot';

export const env = parseEnvVariables(
	object({
		/* eslint-disable @typescript-eslint/naming-convention */
		AWS_REGION: string([minLength(1)]),
		DYNAMODB_TABLE_NAME: string([minLength(1)]),
		/* eslint-enable @typescript-eslint/naming-convention */
	}),
);
