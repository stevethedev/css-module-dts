import { test, expect } from "vitest";
import createDtsFile from "./create-dts-file.js";

test("creates a default export", () => {
  const classNames = new Set(["foo", "bar", "baz"]);
  const fileContent = createDtsFile("path/to/test1.module.css", classNames);
  expect(fileContent).toMatch(
    `export default {} as Record<"bar" | "baz" | "foo", string>;`,
  );
});

test("creates named exports", () => {
  const classNames = new Set(["foo", "bar", "baz"]);
  const fileContent = createDtsFile("path/to/test2.module.css", classNames);
  expect(fileContent).toMatch("export const foo: string;");
  expect(fileContent).toMatch("export const bar: string;");
  expect(fileContent).toMatch("export const baz: string;");
});

test("handles empty sets", () => {
  const classNames = new Set<string>();
  const fileContent = createDtsFile("path/to/test3.module.css", classNames);
  expect(fileContent).not.toMatch("export default");
});

test("handles invalid class names", () => {
  const classNames = new Set(["foo", "bar", "baz", "123"]);
  const fileContent = createDtsFile("path/to/test4.module.css", classNames);
  expect(fileContent).toMatch("export const foo: string;");
  expect(fileContent).toMatch("export const bar: string;");
  expect(fileContent).toMatch("export const baz: string;");
  expect(fileContent).not.toMatch("export const 123: string;");
  expect(fileContent).toMatch(
    'export default {} as Record<"123" | "bar" | "baz" | "foo", string>;',
  );
});

test("holistic generation", () => {
  const classNames = new Set(["foo", "bar", "baz", "123"]);
  const fileContent = createDtsFile("path/to/test5.module.css", classNames);

  expect(fileContent).toMatch(
    `declare namespace "path/to/test5.module.css" {
  export const bar: string;
  export const baz: string;
  export const foo: string;
  export default {} as Record<"123" | "bar" | "baz" | "foo", string>;
}
`,
  );
});
