import { readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { glob } from "glob";
import createDtsFile from './create-dts-file'
import extractClassNames from './extract-class-names'

extractCssModules("C:\\Users\\steve\\IdeaProjects\\dnd-helper", "**/*.module.scss").then(console.log);

async function extractCssModules(rootDir: string, globPattern: string) {
  const files = await glob(join(rootDir, globPattern), { absolute: true });

  const processedFiles = await Promise.all(
    files.map((file) => processFile(rootDir, file)),
  );

  return processedFiles.join("\n\n");
}

async function processFile(rootDir: string, fileName: string): Promise<string> {
  const content = await readFile(fileName, "utf-8");
    const classNames = extractClassNames(content);
    return createDtsFile(relative(rootDir, fileName), classNames);
}
