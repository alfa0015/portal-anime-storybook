/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/vue3-vite',
  core: {
    allowedHosts: true,
  },
  features: {
    // display-review (addon-mcp) requires this for direct MCP clients (our .mcp.json "http" entry);
    // changeDetection defaults to true, experimentalReview is opt-in
    experimentalReview: true,
  },
}
export default config
