import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "glob";
import createDtsFile from "./create-dts-file.js";
import extractClassNames from "./extract-class-names.js";

export default async function extractCssModules(
  rootDir: string,
  globPattern: string,
) {
  const posixPattern = toPosixPath(join(rootDir, globPattern));
  const files = await glob(posixPattern, {
    absolute: true,
  });

  const processedFiles = await Promise.all(
    files.map(
      async (file) => [`${file}.d.ts`, await processFile(file)] as const,
    ),
  );

  return new Map(processedFiles);
}

async function processFile(fileName: string): Promise<string> {
  const content = await readFile(fileName, "utf-8");
  const classNames = extractClassNames(content);
  return createDtsFile(classNames);
}

function toPosixPath(path: string) {
  return path.split("\\").join("/");
}
