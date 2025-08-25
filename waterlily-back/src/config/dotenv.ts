import * as dotenv from 'dotenv';
dotenv.config();

import type { SignOptions } from 'jsonwebtoken';

interface AppEnv {

    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;

    PORT: number | string;

    JWT_SECRET: string;
    JWT_EXPIRES_IN: SignOptions['expiresIn'];

}

const rawExpires = process.env.JWT_EXPIRES_IN ?? '7d';

const coercedExpires: SignOptions['expiresIn'] = /^\d+$/.test(String(rawExpires)) ? Number(rawExpires) : (rawExpires as unknown as SignOptions['expiresIn']);

const env: AppEnv = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'waterlily',
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_EXPIRES_IN: coercedExpires,
}
if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
}
export default env;

