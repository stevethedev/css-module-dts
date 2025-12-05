import { createHash } from "node:crypto";

export default function createDtsFile(classNames: Set<string>): string {
  const constExports = getNamedExports(classNames);
  const defaultExport = getDefaultExport(classNames);
  return `${constExports}\n${defaultExport}\n`;
}

function getNamedExports(classNames: Set<string>): string {
    return Array.from(classNames).toSorted()
        .map((className): string | null => {
            try {
                const fn = new Function(className, `return ${className};`);
                fn(className);
                return `export const ${className}: string;`
            } catch {
                return `// Cannot create named export for ${className}`
            }
        })
        .join("\n");
}

function getDefaultExport(classNames: Set<string>): string {
  const classNameArray: string[] = Array.from(classNames).toSorted();
  const defaultNames = classNameArray
    .map((cn) => JSON.stringify(cn))
    .join(" | ");

  if (!defaultNames.length) {
    return "\n// No default export\n";
  }

  const defaultExportName = getDefaultExportName(classNames);
  return `\ndeclare const ${defaultExportName}: Record<${defaultNames}, string>;\nexport default ${defaultExportName};`;
}

function getDefaultExportName(classNames: Set<string>): string {
  const baseExportName = "classes";

  let defaultExportName = baseExportName;
  const classNamesArray = Array.from(classNames);
  while (classNames.has(defaultExportName)) {
    const hashedClassNames = classNamesArray.join(";");
    const hashed = createHash("sha1")
      .update(defaultExportName + hashedClassNames)
      .digest("hex")
      .slice(0, 6);
    defaultExportName = `${baseExportName}${hashed}`;
  }
  return defaultExportName;
}
