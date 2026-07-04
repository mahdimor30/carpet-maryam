// src/db/index.ts
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'
import { env } from 'cloudflare:workers'

export function getDb() {
  console.log(env.carpet_maryam_db)
  return drizzle(env.carpet_maryam_db, { schema })
}