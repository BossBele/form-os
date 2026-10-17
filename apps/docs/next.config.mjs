/** @type {import('next').NextConfig} */
const basePath = process.env.DOCS_BASE_PATH || undefined;

const nextConfig = {
  output: basePath ? 'export' : undefined,
  basePath,
  transpilePackages: ['@form-os/core', '@form-os/react', '@form-os/schema'],
  reactStrictMode: true,
};

export default nextConfig;
