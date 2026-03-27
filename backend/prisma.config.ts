import { defineConfig } from '@prisma/config';
import 'dotenv/config';

/**
 * Prisma 7 Configuration
 * This file handles the datasource configuration for Prisma CLI (Migrate, Introspection).
 * It uses dotenv to ensure process.env.DATABASE_URL is available during migrations.
 */
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});