import {config} from 'dotenv';

/**
 * Loads environment variables from a .env file based on the current NODE_ENV
 * For example, .env.development.local or .env.production.local
 * If NODE_ENV is not set, it defaults to 'development'
 */
config({path:`.env.${process.env.NODE_ENV || 'development'}.local`});

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRATION, ARCJET_API_KEY, ARCJET_ENV } = process.env;