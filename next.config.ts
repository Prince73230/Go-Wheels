import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const lanHosts = Object.values(networkInterfaces())
  .flatMap((interfaces) => interfaces ?? [])
  .filter((network) => network.family === "IPv4" && !network.internal)
  .map((network) => network.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: lanHosts,
  reactCompiler: true,
};

export default nextConfig;
