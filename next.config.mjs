/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
            },
            {
                protocol: "https",
                hostname: "*.supabase.co",
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
