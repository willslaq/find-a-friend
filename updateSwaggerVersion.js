import fs from 'fs'
const pkg = await import('./package.json', { assert: { type: 'json' } });

const appFile = './src/app.ts'
const appFileContent = fs.readFileSync(appFile, 'utf-8')

const versionRegex = /version: "([\d]+\.[\d]+\.[\d]+)"/
const currentVersionMatch = appFileContent.match(versionRegex)

if (currentVersionMatch) {
    const currentVersion = currentVersionMatch[1]

    if(currentVersion !== pkg.version) {
        const updatedAppFileContent = appFileContent.replace(
            versionRegex,
            `version: "${pkg.version}"`
        )
    
        fs.writeFileSync(appFile, updatedAppFileContent, 'utf-8')
        console.log(`Updated ${appFile} with version ${pkg.version}`)
    } else {
        console.log(`${appFile} is already up to date with version ${pkg.version}`)
    }
} else {
    console.error(`Could not find version in ${appFile}`)
}

