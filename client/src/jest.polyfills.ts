// In a Node.js environment (Jest), browser-standard APIs such as
// TextEncoder / TextDecoder may not exist.
// Some libraries (e.g. react-router) assume these APIs are available,
// which causes tests to fail when running outside the browser.
// To fix this, we polyfill TextEncoder / TextDecoder globally
// using Node.js implementations from `util`.

import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from "util"; // Node.js implementations used as browser-compatible substitutes

// In TypeScript, `globalThis.TextEncoder` is usually typed as
// the *browser* TextEncoder interface.
// However, `util.TextEncoder` has slightly different type definitions,
// so assigning it directly causes TypeScript errors.
// To work around this, we define a global type that *may* have
// TextEncoder / TextDecoder attached.

type GlobalWithWebText = typeof globalThis & {
  // Treat these as browser-style TextEncoder / TextDecoder types
  TextEncoder?: typeof globalThis.TextEncoder;
  TextDecoder?: typeof globalThis.TextDecoder;
};

// `globalThis` represents the global object in any JS environment
// (window in browsers, global in Node.js).
// Because TypeScript’s built-in typings may not allow assigning
// TextEncoder/TextDecoder directly, we first cast to `unknown`,
// then to our custom global type that allows these properties.

const globalInterface = globalThis as unknown as GlobalWithWebText;

// If TextEncoder is not already defined (common in Node/Jest),
// attach Node.js's TextEncoder to the global object.
// The double cast (`as unknown as ...`) is intentional:
// we assume runtime compatibility and only bypass TypeScript's
// strict type mismatch for testing purposes.

if (!globalInterface.TextEncoder) {
  globalInterface.TextEncoder = NodeTextEncoder as unknown as typeof globalThis.TextEncoder;
}

// Same approach for TextDecoder.
// This ensures libraries like react-router can safely access
// TextDecoder without crashing in the test environment.

if (!globalInterface.TextDecoder) {
  globalInterface.TextDecoder = NodeTextDecoder as unknown as typeof globalThis.TextDecoder;
}
