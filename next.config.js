const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper module resolution
  experimental: {
    esmExternals: true,
  },

  // Webpack configuration for proper path resolution
  webpack: (config, { isServer, dev }) => {
    // Add comprehensive alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@/lib": path.resolve(__dirname, "src/lib"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
      "@/app": path.resolve(__dirname, "src/app"),
    };

    // Ensure proper module resolution order
    config.resolve.modules = [path.resolve(__dirname, "src"), "node_modules"];

    // Add file extensions for better resolution
    config.resolve.extensions = [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".json",
      ...config.resolve.extensions,
    ];

    // Ensure proper resolution for both server and client
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },

  // Environment variables
  env: {
    CUSTOM_KEY: "my-value",
  },

  // Ensure proper static file handling
  trailingSlash: false,

  // Optimize for production
  swcMinify: true,
};

module.exports = nextConfig;
