import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security Enhancement: Prevent clickjacking attacks by denying rendering in frames/iframes
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Security Enhancement: Prevent MIME-sniffing vulnerabilities
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Security Enhancement: Restrict referrer information sent with cross-origin requests
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          // Security Enhancement: Enable legacy XSS filtering as defense in depth
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Security Enhancement: Enforce secure connections via HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
