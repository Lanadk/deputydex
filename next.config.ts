import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            //protocol : 'https' + hostname: 'nosdeputes.fr' pour autoriser l'affichage.
        ],
    },
};

export default nextConfig;
