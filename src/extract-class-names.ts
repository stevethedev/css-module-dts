import postcss, { type Document as Document_ } from "postcss";
import * as postcssScss from "postcss-scss";
import * as postcssLess from "postcss-less";
import type { ContainerWithChildren } from "postcss/lib/container";

export default function extractClassNames(css: string): Set<string> {
  const root = parse(css);

  const classNames = new Set<string>();

  root.walkRules((rule) => {
    const selectors = rule.selector?.split(",") ?? [];

    for (const selector of selectors) {
      let realSelector = selector;
      let parent: ContainerWithChildren | Document_ | undefined = rule.parent;
      while (parent && realSelector.startsWith("&")) {
        if (parent.type === "rule" && parent.selector) {
          realSelector = `${parent.selector}${realSelector.slice(1)}`;
        }
        parent = parent.parent;
      }
      const matches = realSelector.match(/\.([a-zA-Z0-9-_]+)/g) ?? [];
      for (const match of matches) {
        classNames.add(match.slice(1));
      }
    }
  });

  return classNames;
}

function parse(css: string) {
  try {
    return postcss.parse(css);
  } catch {}

  try {
    return postcssScss.parse(css);
  } catch {}

  try {
    return postcssLess.parse(css);
  } catch {}

  throw new Error("Failed to parse CSS");
}
