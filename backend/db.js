import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM recibido, cerrando pool de BD...");
  pool.end(() => {
    console.log("Pool de BD cerrado");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT recibido, cerrando pool de BD...");
  pool.end(() => {
    console.log("Pool de BD cerrado");
    process.exit(0);
  });
});
