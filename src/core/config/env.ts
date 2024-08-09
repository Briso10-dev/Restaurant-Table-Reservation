// src/core/config/env.ts

import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
	PORT: get('PORT').required().asPortNumber(),
	API_PREFIX: get('DEFAULT_API_PREFIX').default('/api/v1').asString(),
	NODE_ENV: get('NODE_ENV').default('development').asString(),
	MONGO_INITDB_ROOT_USERNAME: get('MONGO_INITDB_ROOT_USERNAME').default('admin').asString(),
	MONGO_INITDB_ROOT_PASSWORD: get('MONGO_INITDB_ROOT_PASSWORD').default('test123').asString(),
	MONGO_DB_NAME: get('MONGO_DB_NAME').default('worketyamo').asString(),
	JWT_ACCESS_TOKEN_PRIV: get("JWT_ACCESS_TOKEN_PRIV").required().asString(),
	JWT_REFRESH_TOKEN_PRIV: get("JWT_REFRESH_TOKEN_PRIV").required().asString(),
	JWT_ACCESS_TOKEN_PUB: get("JWT_ACCESS_TOKEN_PUB").required().asString(),
	JWT_REFRESH_TOKEN_PUB: get("JWT_REFRESH_TOKEN_PUB").required().asString(),
	// GMAIL configurations
	SERVICE: get("SERVICE").required().asString(),
	MAIL_HOST: get("MAIL_HOST").required().asString(),
	MAIL_PORT: get("MAIL_PORT").required().asPortNumber(),
	MAIL_SECURE: get("MAIL_SECURE").required().asBool(),
	MAIL_USER: get("MAIL_USER").required().asString(),
	MAIL_PASS: get("MAIL_PASS").required().asString(),
	MAIL_FROM: get("MAIL_FROM").required().asString(),
	ENDPOINT: get("END_POINT").required().asString(),
	ACCESS_KEY: get("ACCESS_KEY").required().asString(),
	SECRET_KEY: get("SECRET_KEY").required().asString(),
	REGION: get("REGION").required().asString(),
}


export const CONNECTION_STRING = `mongodb://${envs.MONGO_INITDB_ROOT_USERNAME}:${envs.MONGO_INITDB_ROOT_PASSWORD}@172.28.0.2:27017/${envs.MONGO_DB_NAME}?authSource=admin`;
