import { test, expect } from "vitest";
import extractClassNames from "./extract-class-names.js";

test("it extracts class names from CSS files", () => {
  const css = `
    .foo { color: red; }
    .bar { color: blue;
        .baz { color: green; } 
    }
    .first.second { color: purple; }
    #id { color: yellow; }
    main { color: orange; }
    `;

  expect(extractClassNames(css)).toEqual(
    new Set(["foo", "bar", "baz", "first", "second"]),
  );
});

test("it handles complex CSS", () => {
  const css = getCss();
  expect(extractClassNames(css)).toEqual(
    new Set([
      "card__subtitle",
      "btn",
      "secondary",
      "flex",
      "center",
      "card",
      "card__title",
    ]),
  );
});

test("extracts class names from SCSS files", () => {
  const scss = `
    @use "@lib/ui-styles/color";
    .foo { color: red; }
    .bar { color: blue;
    .baz { color: green; } }
    `;

  expect(extractClassNames(scss)).toEqual(new Set(["foo", "bar", "baz"]));
});

test("it handles complex SCSS", () => {
  const css = getSass();
  expect(extractClassNames(css)).toEqual(
    new Set([
      "actions",
      "card__subtitle",
      "btn",
      "secondary",
      "card",
      "card__title",
    ]),
  );
});

test("it handles complex LESS", () => {
  const css = getLess();
  expect(extractClassNames(css)).toEqual(
    new Set([
      "actions",
      "card__subtitle",
      "box-shadow",
      "button",
      "btn",
      "secondary",
      "card",
      "card__title",
    ]),
  );
});

function getCss() {
  return `
        /* CSS with custom properties, utility classes, and responsive rules */
        :root{
          --color-bg: #0f1724;
          --color-surface: #0b1220;
          --color-accent: #7c3aed;
          --color-text: #e6eef8;
          --radius: 12px;
          --gap: 16px;
          --card-shadow: 0 6px 18px rgba(2,6,23,0.6);
          --transition: 180ms ease;
        }
        
        /* Reset-ish */
        * { box-sizing: border-box; }
        html,body { height:100%; margin:0; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:var(--color-bg); color:var(--color-text); }
        
        /* Component: Card */
        .card {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)) , var(--color-surface);
          border-radius: var(--radius);
          padding: calc(var(--gap) * 1.25);
          box-shadow: var(--card-shadow);
          display: grid;
          gap: 8px;
          width: 100%;
          max-width: 520px;
          transition: transform var(--transition), box-shadow var(--transition);
        }
        
        .card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(2,6,23,0.7); }
        
        /* Card header */
        .card__title {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        
        .card__subtitle {
          margin: 0;
          font-size: 0.875rem;
          color: rgba(230,238,248,0.75);
        }
        
        /* Button */
        .btn {
          display:inline-block;
          padding: 10px 14px;
          border-radius: 8px;
          background: var(--color-accent);
          color: white;
          text-decoration: none;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: transform var(--transition), filter var(--transition);
        }
        
        .btn:active { transform: translateY(1px) scale(0.998); }
        .btn.secondary {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.06);
          color: var(--color-text);
        }
        
        /* Utilities */
        .flex { display:flex; }
        .center { align-items:center; justify-content:center; }
        
        /* Responsive */
        @media (max-width: 640px) {
          :root { --gap: 12px; --radius: 10px; }
          .card { padding: calc(var(--gap) * 0.9); }
          .card__title { font-size: 1rem; }
        }
    `;
}

function getSass() {
  return `
        // SCSS using variables, nesting, mixins, functions, placeholder and responsive mixin
        
        $color-bg: #0f1724;
        $color-surface: #0b1220;
        $color-accent: #7c3aed;
        $color-text: #e6eef8;
        $radius: 12px;
        $gap: 16px;
        $card-shadow: 0 6px 18px rgba(2,6,23,0.6);
        $transition: 180ms;
        
        // Simple function
        @function rem($px) {
          @return #{$px / 16}rem;
        }
        
        // Mixin for responsive breakpoint
        @mixin respond($break) {
          @if $break == small {
            @media (max-width: 640px) { @content; }
          } @else if $break == medium {
            @media (max-width: 900px) { @content; }
          }
        }
        
        // Reusable button mixin
        @mixin button-base($bg, $color: white) {
          display: inline-block;
          padding: 10px 14px;
          border-radius: 8px;
          background: $bg;
          color: $color;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: transform $transition, filter $transition;
        }
        
        %card-common {
          border-radius: $radius;
          padding: $gap * 1.25;
          box-shadow: $card-shadow;
        }
        
        // Styles
        * { box-sizing: border-box; }
        html, body { height: 100%; margin: 0; font-family: Inter, system-ui, sans-serif; background: $color-bg; color: $color-text; }
        
        .card {
          @extend %card-common;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)), $color-surface;
          display: grid;
          gap: 8px;
          max-width: 520px;
        
          &:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(2,6,23,0.7); }
        
          &__title { margin: 0; font-size: rem(18); font-weight: 600; }
          &__subtitle { margin: 0; font-size: rem(14); color: rgba($color-text, 0.8); }
        
          .actions { display:flex; gap: 8px; margin-top: 6px; }
        
          .btn {
            @include button-base($color-accent);
            &.secondary {
              @include button-base(transparent, $color-text);
              border: 1px solid rgba(255,255,255,0.06);
            }
          }
        }
        
        // Responsive tweak
        @include respond(small) {
          :root { --gap: 12px; }
          .card { padding: $gap * 0.8; &__title { font-size: rem(16); } }
        }
    `;
}

function getLess() {
  return `
        // LESS with variables, parametric mixin, guards, nested rules
        
        @color-bg: #0f1724;
        @color-surface: #0b1220;
        @color-accent: #7c3aed;
        @color-text: #e6eef8;
        @radius: 12px;
        @gap: 16px;
        @card-shadow: 0 6px 18px rgba(2,6,23,0.6);
        @transition: 180ms;
        
        .box-shadow(@x, @y, @blur, @color) {
          -webkit-box-shadow: @x @y @blur @color;
          box-shadow: @x @y @blur @color;
        }
        
        .button(@bg, @color: #fff) {
          display: inline-block;
          padding: 10px 14px;
          border-radius: 8px;
          background: @bg;
          color: @color;
          font-weight: 600;
          border: 0;
          cursor: pointer;
          transition: transform @transition, filter @transition;
        }
        
        * { box-sizing: border-box; }
        html, body { height:100%; margin:0; font-family: Inter, system-ui, sans-serif; background:@color-bg; color:@color-text; }
        
        .card {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)), @color-surface;
          border-radius: @radius;
          padding: (@gap * 1.25);
          .box-shadow(0, 6px, 18px, rgba(2,6,23,0.6));
          display: grid;
          gap: 8px;
          max-width: 520px;
        
          &:hover {
            transform: translateY(-6px);
            .box-shadow(0, 16px, 36px, rgba(2,6,23,0.7));
          }
        
          &__title { margin: 0; font-size: 1.125rem; font-weight: 600; }
          &__subtitle { margin: 0; font-size: 0.875rem; color: fade(@color-text, 80%); }
        
          .actions { display:flex; gap: 8px; margin-top: 6px; }
        
          .btn { .button(@color-accent); 
            &.secondary { .button(transparent, @color-text); border: 1px solid rgba(255,255,255,0.06); }
          }
        }
        
        @media (max-width: 640px) {
          .card { padding: (@gap * 0.9); &__title { font-size: 1rem; } }
        }
    `;
}
