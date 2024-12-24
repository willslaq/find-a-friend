import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

const appFilePath = './src/app.ts';
const appFileContent = fs.readFileSync(appFilePath, 'utf8');

const versionRegex = /version: "([\d]+\.[\d]+\.[\d]+)"/;
const currentVersionMatch = appFileContent.match(versionRegex);

if (currentVersionMatch) {
  const currentVersion = currentVersionMatch[1];

  if (currentVersion !== pkg.version) {
    const updatedAppFileContent = appFileContent.replace(
      versionRegex,
      `version: "${pkg.version}"`
    );

    fs.writeFileSync(appFilePath, updatedAppFileContent, 'utf8');
    console.log(`Swagger version updated to ${pkg.version}`);
  } else {
    console.log(`Swagger version is already up to date: ${pkg.version}`);
  }
} else {
  console.error('Version string not found in app.ts');
}
