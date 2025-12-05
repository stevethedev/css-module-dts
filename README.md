# css-module-dts

Generate TypeScript declaration (.d.ts) files for CSS Modules.

This small CLI and library scans a directory for CSS/SCSS/LESS module files (by default `**/*.module.{css,sass,scss,less}`), extracts class names, and generates `.d.ts` style declaration output that can be written to a file or printed to stdout.

## Key features

- Works with CSS, SCSS, and LESS (uses PostCSS + language parsers)
- CLI-friendly: print results or write to a file
- Small, dependency-light implementation

## Installation

Install from npm:

```shell
npm install --save-dev css-module-dts
```

Or use npx for a one-off run (when published):

```shell
npx css-module-dts <rootDir>
```

## Local development

1. Install dev deps:

```shell
npm install
```

2. Build the project:

```shell
npm run build
```

3. Run the CLI from the built output:

```shell
node dist/cli.js <rootDir> -p "**/*.module.{css,sass,scss,less}" -w out.d.ts
```

## Usage (CLI)

```shell
css-module-dts [options] <rootDir>
```

### Positional arguments

- `rootDir` Root directory to scan for CSS modules (required)

### Options

- `-p`, `--pattern` Glob pattern to locate module files (default: `**/*.module.{css,sass,scss,less}`)
- `-w`, `--write` Path to write the generated declaration output. If omitted, output is written to stdout.

## Examples

### Print declarations for all module files under `src`

```shell
npx css-module-dts src
```

### Write declarations to `types.d.ts` (local, after building)

```shell
npx css-module-dts src -w types.d.ts
```

## Library API

The package also exposes small programmatic helpers (ESM):

- `extractCssModules(rootDir: string, globPattern: string): Promise<string>`
  - Scans files matching the glob within `rootDir`, extracts class names, and returns the combined `.d.ts` content as a single string.

- extractClassNames(css: string): Set<string>
  - Extracts class names from a CSS/SCSS/LESS string and returns a Set of names.

- createDtsFile(moduleName: string, classNames: Set<string>): string
  - Creates the `.d.ts` declaration string for a single module path and its class names.

You can import and use these from the built files (dist) or the source during development (Node must support ESM):

import extractCssModules from './dist/extract-css-modules.js';
// or during dev after build:
// import extractCssModules from './src/extract-css-modules.js';

Tests

Run the test suite with:

npm test

Contributing

Contributions welcome — please open issues or PRs. A few suggestions:

- Run formatting/lint checks before committing: `npm run fix` / `npm run check`
- Add tests for parsing edge-cases when adding features

License

MIT — see the `license` field in package.json.

Notes and assumptions

- This project uses ESM ("type": "module") and expects a relatively recent Node.js that supports ESM imports (Node 14+ recommended).
- The CLI specified in package.json points to `dist/cli.js`; make sure to run `npm run build` before using the local CLI.
