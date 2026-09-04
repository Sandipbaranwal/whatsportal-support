import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root. Without it Turbopack walks up the tree and picks
  // up an unrelated package-lock.json outside this project.
  turbopack: { root: projectRoot },
};

export default nextConfig;
