import { ComicBookService } from './stacks/services/comic-book';
import { Dynamodb } from './stacks/dynamodb';

import { type SSTConfig } from 'sst';

export default {
	config(_input) {
		return {
			name: 'mouseion',
			region: 'us-east-1',
		};
	},
	stacks(app) {
		app.stack(Dynamodb).stack(ComicBookService);
	},
} satisfies SSTConfig;
