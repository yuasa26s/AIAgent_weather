import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  async rewrites() {
    return [
      {
        // 💡 フロントエンドが「/api/v1/chat」を叩いたとき、
        // バックエンド（FastAPI）のポート8000番へリクエストをそのまま転送する設定
        source: '/api/v1/:path*',
        destination: 'http://127.0.0.1:8000/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;