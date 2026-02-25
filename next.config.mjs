/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/cart',
                destination: '/checkout',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
