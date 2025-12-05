import { test, expect } from "vitest";
import createDtsFile from "./create-dts-file.js";

test("creates a default export", () => {
  const classNames = new Set(["foo", "bar", "baz"]);
  const fileContent = createDtsFile(classNames);
  expect(fileContent).toMatch(
    `
declare const classes: Record<"bar" | "baz" | "foo", string>;
export default classes;
`.slice(1),
  );
});

test("creates named exports", () => {
  const classNames = new Set(["foo", "bar", "baz"]);
  const fileContent = createDtsFile(classNames);
  expect(fileContent).toMatch("export const foo: string;");
  expect(fileContent).toMatch("export const bar: string;");
  expect(fileContent).toMatch("export const baz: string;");
});

test("handles empty sets", () => {
  const classNames = new Set<string>();
  const fileContent = createDtsFile(classNames);
  expect(fileContent).not.toMatch("export default");
});

test("handles invalid class names", () => {
  const classNames = new Set(["foo", "bar", "baz", "123"]);
  const fileContent = createDtsFile(classNames);
  expect(fileContent).toMatch("export const foo: string;");
  expect(fileContent).toMatch("export const bar: string;");
  expect(fileContent).toMatch("export const baz: string;");
  expect(fileContent).not.toMatch("export const 123: string;");
  expect(fileContent).toMatch(
    `
declare const classes: Record<"123" | "bar" | "baz" | "foo", string>;
export default classes;
`.slice(1),
  );
});

test("holistic generation", () => {
  const classNames = new Set(["foo", "bar", "baz", "123"]);
  const fileContent = createDtsFile(classNames);

  expect(fileContent).toMatch(
    `
export const bar: string;
export const baz: string;
export const foo: string;
declare const classes: Record<"123" | "bar" | "baz" | "foo", string>;
export default classes;
`.slice(1),
  );
});
