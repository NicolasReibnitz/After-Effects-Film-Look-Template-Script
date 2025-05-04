import { copyFile, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import { TscWatchClient } from 'tsc-watch/client.js';

// Polyfill for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const watch = new TscWatchClient();

const source = resolve(__dirname, '..', 'dist', 'Film Look.jsx');
let destination;

function getLatestAfterEffectsVersionPath() {
	const basePath = join(process.env.HOME, 'Library', 'Preferences', 'Adobe', 'After Effects');
	const versionFolders = readdirSync(basePath);

	// Filter out non-version folders and sort them in descending order
	const sortedVersions = versionFolders
		.filter(folder => /^\d+\.\d+$/.test(folder)) // Match version pattern like "25.1"
		.sort((a, b) => parseFloat(b) - parseFloat(a)); // Sort numerically in descending order

	if (sortedVersions.length === 0) {
		throw new Error('No After Effects version folders found.');
	}

	return join(basePath, sortedVersions[0]);
}

function incrementPatchVersion() {
	const packageJsonPath = resolve(__dirname, '..', 'package.json');
	console.log('packageJsonPath: ', packageJsonPath);
	const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

	const versionParts = packageJson.version.split('.');
	versionParts[2] = (parseInt(versionParts[2], 10) + 1).toString(); // Increment patch version
	packageJson.version = versionParts.join('.');

	writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
	console.log(`Version updated to ${packageJson.version}`);

	return packageJson.version;
}

function updateFileVersion(filePath, version) {
	const fileContent = readFileSync(filePath, 'utf8');
	const updatedContent = fileContent.replace('####VERSION####', version);
	writeFileSync(filePath, updatedContent, 'utf8');
}

// Usage
try {
	const latestVersionPath = getLatestAfterEffectsVersionPath();
	const destinationDir = join(latestVersionPath, 'Scripts', 'ScriptUI Panels');
	destination = join(destinationDir, 'Film Look.jsx');

	// Ensure the destination directory exists
	mkdirSync(destinationDir, { recursive: true });

	watch.on('success', () => {
		const newVersion = incrementPatchVersion(); // Increment version on success
		updateFileVersion(source, newVersion); // Update version in the source file

		copyFile(source, destination, err => {
			if (err) {
				console.error('Error copying file:', err);
			} else {
				console.log('File successfully copied to After Effects scripts folder:', destination);
			}
		});
	});

	watch.start('--project', '.');
} catch (error) {
	console.error(error.message);
}
