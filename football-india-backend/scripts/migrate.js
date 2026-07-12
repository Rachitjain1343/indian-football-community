const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function loadEnv() {
  const file = path.join(process.cwd(), '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([^#][^=]+)=(.*)$/);
    if (!match || process.env[match[1].trim()]) continue;
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
}

async function main() {
  loadEnv();
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query('create table if not exists public.schema_migrations (name text primary key, applied_at timestamptz not null default now())');
    const dir = path.join(process.cwd(), 'src', 'database', 'migrations');
    const files = fs.readdirSync(dir).filter((name) => name.endsWith('.sql')).sort();
    for (const name of files) {
      const exists = await client.query('select 1 from public.schema_migrations where name=$1', [name]);
      if (exists.rowCount) { console.log(`skip ${name}`); continue; }
      const sql = fs.readFileSync(path.join(dir, name), 'utf8');
      if (!sql.trim() || /^\s*--[^\n]*\s*$/s.test(sql)) { console.log(`empty ${name}`); continue; }
      await client.query('begin');
      try { await client.query(sql); await client.query('insert into public.schema_migrations(name) values($1)', [name]); await client.query('commit'); console.log(`applied ${name}`); }
      catch (error) { await client.query('rollback'); throw new Error(`${name}: ${error.message}`); }
    }
  } finally { await client.end(); }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
