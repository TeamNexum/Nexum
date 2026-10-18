/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Cloud API base URL baked in at build time; the settings field still overrides it. */
  readonly VITE_NEXUM_CLOUD_URL?: string;
}
