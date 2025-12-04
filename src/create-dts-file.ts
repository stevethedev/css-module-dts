export default function createDtsFile(
  moduleName: string,
  classNames: Set<string>,
): string {
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
    .map((className) => `\n  export const ${className}: string;`)
    .join("");

  const defaultNames = classNameArray
    .map((cn) => JSON.stringify(cn))
    .join(" | ");
  const defaultExport = defaultNames.length
    ? `\n  export default {} as Record<${defaultNames}, string>;`
    : "";
  const exports = `${constExports}${defaultExport}`;
  return `declare namespace ${JSON.stringify(moduleName)} {${exports}\n}\n`;
}
