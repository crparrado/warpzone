/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['warpzone.cl'], // Allow images from the original site if we use them
    },
};

module.exports = nextConfig;
