interface ImportMetaEnv {
  readonly VITE_CP_PORTAL_FEDERATION_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface RuntimeEnv {
  VITE_CP_PORTAL_FEDERATION_API_URL?: string;
  VITE_CP_PORTAL_UI_URI?: string;
}

interface Window {
  _env_?: RuntimeEnv;
}
