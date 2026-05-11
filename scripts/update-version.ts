import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const versionFilePath = join(process.cwd(), "src/lib/version.ts");
const content = readFileSync(versionFilePath, "utf-8");

const versionMatch = content.match(/APP_VERSION = "(\d+)\.(\d+)\.(\d+)"/);
if (versionMatch) {
  const [_, major, minor, patch] = versionMatch;
  const newPatch = parseInt(patch) + 1;
  const newVersion = `${major}.${minor}.${newPatch}`;
  const newDate = new Date().toISOString().split('T')[0];

  const newContent = content
    .replace(/APP_VERSION = ".*"/, `APP_VERSION = "${newVersion}"`)
    .replace(/APP_BUILD_DATE = ".*"/, `APP_BUILD_DATE = "${newDate}"`);

  writeFileSync(versionFilePath, newContent);
  console.log(`Version updated to ${newVersion} (${newDate})`);
}
