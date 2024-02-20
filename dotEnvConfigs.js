import { config } from 'dotenv';
import { fileURLToPath, URL } from 'url';
import { dirname, resolve } from 'path';

const envPath = resolve(dirname(fileURLToPath(new URL(import.meta.url))), '.ENV');

config({ path: envPath });
