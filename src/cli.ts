#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd, stderr, stdout } from "node:process";
import {
  command,
  positional,
  option,
  optional,
  string,
  run,
  boolean,
  flag,
} from "cmd-ts";
import extractCssModules from "./extract-css-modules.js";

const cmd = command({
  name: "css-module-dts",
  args: {
    pattern: option({
      short: "p",
      long: "pattern",
      description: "Glob pattern to match CSS modules",
      type: string,
      defaultValue: () => "**/*.{css,sass,scss,less}",
    }),
    write: flag({
      short: "w",
      long: "write",
      description:
        "Write the generated files to disk instead of printing them to stdout",
      type: optional(boolean),
    }),
    rootDir: positional({
      type: string,
      description: "Root directory to scan for modules",
      displayName: "rootDir",
    }),
  },
  handler: async ({ rootDir, pattern, write }) => {
    const absoluteRootDir = resolve(cwd(), rootDir);
    const result = await extractCssModules(absoluteRootDir, pattern);

    for (const [file, content] of result) {
      stdout.write(`[file] ${file}`);
      if (!write) {
        stdout.write(`\n\`\`\`ts\n${content}\`\`\`\n\n`);
        continue;
      }
      try {
        await writeFile(resolve(absoluteRootDir, file), content, {
          encoding: "utf-8",
        });
        stdout.write(` (success)\n`);
      } catch (e) {
        stdout.write(` (failure)\n`);
        stderr.write(`[error] ${file}: ${String(e)}\n`);
      }
    }
  },
});

void run(cmd, process.argv.slice(2));
