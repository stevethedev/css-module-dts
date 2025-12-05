import { hash } from "node:crypto";

export default function createDtsFile(classNames: Set<string>): string {
  const classNameArray: string[] = Array.from(classNames).toSorted();
  const constExports = classNameArray
    .map((className): string | null => {
      try {
        const fn = new Function(className, `return ${className};`);
        return fn(className);
      } catch {
        return null;
      }
    })
    .filter((v): v is string => typeof v === "string")
    .map((className) => `export const ${className}: string;`)
    .join("\n");

  const defaultExport = getDefaultExport(classNames);
  return `${constExports}${defaultExport}\n`;
}

function getDefaultExport(classNames: Set<string>): string {
  const classNameArray: string[] = Array.from(classNames).toSorted();
  const defaultNames = classNameArray
    .map((cn) => JSON.stringify(cn))
    .join(" | ");

  if (!defaultNames.length) {
    return "";
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
    const hashed = hash("sha1_hex", defaultExportName + hashedClassNames)
      .toString()
      .slice(0, 6);
    defaultExportName = `${baseExportName}${hashed}`;
  }
  return defaultExportName;
}
