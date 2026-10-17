/**
 * Lightswind ships `plugin.js` with no type declarations. This describes the
 * shape Tailwind actually consumes so the config stays type-checked.
 */
declare module 'lightswind/plugin' {
  import type { Config, PluginCreator } from 'tailwindcss/types/config';

  export interface LightswindPluginOptions {
    /** Enables 3D depth and bevel shading across Lightswind components. */
    effect3d?: boolean;
  }

  const lightswindPlugin: (
    options?: LightswindPluginOptions
  ) => { handler: PluginCreator; config?: Partial<Config> };

  export default lightswindPlugin;
}
