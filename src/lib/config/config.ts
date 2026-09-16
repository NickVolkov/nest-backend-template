import fs from 'node:fs';
import path from 'node:path';

import { parse } from 'dotenv';
import { load } from 'js-yaml';
import { ZodObject, ZodTypeAny } from 'zod';

type ConfigObject = Record<string, unknown>;

function isObject(value: unknown): value is ConfigObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function merge(target: ConfigObject, source: ConfigObject): ConfigObject {
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    result[key] = isObject(result[key]) && isObject(value) ? merge(result[key], value) : value;
  }
  return result;
}

function schemaPaths(schema: ZodTypeAny, prefix: string[] = []): string[][] {
  if (schema instanceof ZodObject) {
    return Object.entries(schema.shape).flatMap(([key, child]) =>
      schemaPaths(child as ZodTypeAny, [...prefix, key]),
    );
  }
  return [prefix];
}

function setPath(target: ConfigObject, parts: string[], value: string): void {
  let cursor = target;
  for (const part of parts.slice(0, -1)) {
    if (!isObject(cursor[part])) cursor[part] = {};
    cursor = cursor[part] as ConfigObject;
  }
  cursor[parts.at(-1)!] = value;
}

export function getConfig<T>(
  schema: ZodTypeAny,
  options: { folder: string; files: string[]; envFile?: string },
): T {
  let raw: ConfigObject = {};
  for (const file of options.files) {
    const filename = path.isAbsolute(file) ? file : path.resolve(options.folder, file);
    raw = merge(raw, (load(fs.readFileSync(filename, 'utf8')) as ConfigObject | null) ?? {});
  }

  const envFile = options.envFile ?? path.resolve(process.cwd(), '.env');
  const fileEnv = fs.existsSync(envFile) ? parse(fs.readFileSync(envFile)) : {};
  const env = { ...fileEnv, ...process.env };
  for (const parts of schemaPaths(schema)) {
    const value = env[parts.join('_').toUpperCase()];
    if (value !== undefined) setPath(raw, parts, value);
  }

  return schema.parse(raw) as T;
}
