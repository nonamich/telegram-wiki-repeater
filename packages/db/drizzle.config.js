import dotenv from 'dotenv';

dotenv.config({
  path: './.env.development',
});

/** @type { import("drizzle-kit").Config } */
export default {
  schema: './src/schemas.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    ssl: true,
  },
};
