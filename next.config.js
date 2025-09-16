/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Ensure proper module resolution
    esmExternals: true,
  },
  webpack: (config) => {
    // Ensure proper alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
}

module.exports = nextConfig