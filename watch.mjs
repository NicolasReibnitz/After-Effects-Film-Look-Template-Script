import { copyFile } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import { TscWatchClient } from 'tsc-watch/client.js';

// Polyfill for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const watch = new TscWatchClient();

const source = resolve(__dirname, 'dist', 'Film Look.jsx');
const destination = join(
	process.env.HOME,
	'Library',
	'Preferences',
	'Adobe',
	'After Effects',
	'25.1',
	'Scripts',
	'ScriptUI Panels',
	'Film Look.jsx'
);

watch.on('success', () => {
	copyFile(source, destination, err => {
		if (err) {
			console.error('Error copying file:', err);
		} else {
			console.log('File successfully copied to After Effects scripts folder.');
		}
	});
});

watch.start('--project', '.');
