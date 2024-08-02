const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { dev, isServer }) {
    if (dev && !isServer) {
      const originalEntry = config.entry;
      // eslint-disable-next-line no-param-reassign
      config.entry = async () => {
        const wdrPath = path.resolve(__dirname, "./src//wdyr.ts");
        const entries = await originalEntry();

        if (entries["main.js"] && !entries["main.js"].includes(wdrPath)) {
          entries["main.js"].push(wdrPath);
        }
        return entries;
      };
    }

    return config;
  },
};

module.exports = nextConfig;
