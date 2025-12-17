/// <reference types="vite/client" />

declare module "*.json" {
  const content: unknown;
  export default content;
}
