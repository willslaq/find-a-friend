import fs from 'fs';

const pkg = await import('./package.json', {
  assert: { type: 'json' }
});

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
