const dotenv = require("dotenv");
const { PHASE_PRODUCTION_BUILD } = require("next/dist/shared/lib/constants");
const path = require("path");

const nextConfig = (phase) => {
  const envPath = path.resolve(__dirname, `.env.${process.env.APP_ENV}`);
  const envConfig = dotenv.config({ path: envPath }).parsed;

  if (phase === PHASE_PRODUCTION_BUILD) {
    return {
      env: envConfig,
      reactStrictMode: false,
      swcMinify: true,
      output: "export",
      distDir: "../build",
    };
  } else {
    return {
      env: envConfig,
      reactStrictMode: false,
      swcMinify: true,
    };
  }
};

module.exports = nextConfig;
