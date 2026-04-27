/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Injected at build time via Vite `define`; in Jest see `jest.setup.ts`. */
declare const process: {
  env: ImportMetaEnv;
};
