/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@roldninja/domain", "@roldninja/contracts"],
  images: {
    remotePatterns: [{ protocol: "http", hostname: "localhost" }],
  },
  webpack: (config) => {
    // El paquete @roldninja/shared usa imports con extension .js (estilo ESM/NodeNext).
    // Webpack necesita mapear esas extensiones a los archivos .ts reales.
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    // konva intenta requerir el paquete nativo "canvas" (solo Node); lo ignoramos.
    config.resolve.alias = { ...config.resolve.alias, canvas: false };
    return config;
  },
};

export default nextConfig;
