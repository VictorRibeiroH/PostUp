/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    POSTGRES_URL_UNPOOLED: process.env.POSTGRES_URL_UNPOOLED,
    POSTGRES_URL_NO_SSL: process.env.POSTGRES_URL_NO_SSL,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    PGHOST: process.env.PGHOST,
    PGHOST_UNPOOLED: process.env.PGHOST_UNPOOLED,
    POSTGRES_USER: process.env.POSTGRES_USER,
    PGUSER: process.env.PGUSER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    PGPASSWORD: process.env.PGPASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
    PGDATABASE: process.env.PGDATABASE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default nextConfig;

