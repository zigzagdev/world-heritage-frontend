/**
 * Jest (Node.js) environment does not always provide browser-standard
 * TextEncoder / TextDecoder.
 * Some libraries (e.g. react-router) assume these APIs exist.
 *
 * This file polyfills TextEncoder / TextDecoder globally
 * using Node.js implementations from `util`.
 *
 * References:
 * - Node.js util.TextEncoder / TextDecoder
 *   https://nodejs.org/api/util.html
 * - MDN TextEncoder
 *   https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
 */

import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from "util";

// Allow attaching browser-style TextEncoder / TextDecoder to globalThis
type GlobalWithWebText = typeof globalThis & {
  TextEncoder?: typeof globalThis.TextEncoder;
  TextDecoder?: typeof globalThis.TextDecoder;
};

const globalInterface = globalThis as unknown as GlobalWithWebText;

// Polyfill TextEncoder if missing (common in Jest / Node)
if (!globalInterface.TextEncoder) {
  globalInterface.TextEncoder = NodeTextEncoder as unknown as typeof globalThis.TextEncoder;
}

// Polyfill TextDecoder if missing
if (!globalInterface.TextDecoder) {
  globalInterface.TextDecoder = NodeTextDecoder as unknown as typeof globalThis.TextDecoder;
}
