/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "codin-s3-bucket.s3.ap-northeast-2.amazonaws.com",
            "starinu.inu.ac.kr",
            "ite.inu.ac.kr",
            "ese.inu.ac.kr"// S3 버킷 도메인 추가
        ],
    },
};

module.exports = nextConfig;
