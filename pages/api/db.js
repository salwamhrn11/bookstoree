import { Pool } from "pg";

const pool = new Pool({
  host: "8.222.221.132",
  database: "tugastbd",
  user: "salwa",
  password: "salwam11",
  port: 5432,
});

export function query(text, params) {
  return pool.query(text, params);
}
export async function transact(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
