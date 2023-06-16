const { createPool } = require("mysql2/promise");

// Create a connection to doctors_project database
const pool = createPool({
  host: process.env.host,
  port: "3306",
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 10000000000000000000000000000,
  queueLimit: 0,
});

// Test the connection
pool
  .getConnection()
  .then((connection) => {
    console.log(`Connected to MySQL database as ID ${connection.threadId}`);
    connection.release();
  })
  .catch((error) => {
    console.error(`Unable to connect to MySQL database: ${error}`);
    process.exit(1);
  });

// Function to refresh database connection every minute
function refreshConnection() {
  setInterval(async () => {
    console.log("Refreshing database connection...");
    const connection = await pool.getConnection();
    connection.release();
    console.log("Database connection refreshed.");
  }, 2 * 60 * 1000); // refresh every 2 minute
}

refreshConnection();

module.exports = pool;
