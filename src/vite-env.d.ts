/// <reference types="vite/client" />

declare global {
  var Buffer: typeof import('buffer').Buffer;
}

declare const globalThis: {
  Buffer: typeof import('buffer').Buffer;
} & typeof globalThis;