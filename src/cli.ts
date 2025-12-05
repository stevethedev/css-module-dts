#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd, stdout } from "node:process";
import { command, positional, option, optional, string, run } from "cmd-ts";
import extractCssModules from "./extract-css-modules.js";

const cmd = command({
  name: "css-module-dts",
  args: {
    pattern: option({
      short: "p",
      long: "pattern",
      type: string,
      defaultValue: () => "**/*.module.{css,sass,scss,less}",
    }),
    write: option({
      short: "w",
      long: "write",
      type: optional(string),
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

    if (write) {
      await writeFile(write, result, { encoding: "utf-8" });
      return;
    }

    stdout.write(result);
  },
});

void run(cmd, process.argv.slice(2));
