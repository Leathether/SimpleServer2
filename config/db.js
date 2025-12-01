import mysql from 'mysql2/promise';
// You need to run this as a superuser to create a database


// Create a connection pool for MySQL
const pool = mysql.createPool({
  socketPath: '/var/run/mysqld/mysqld.sock',
  user: 'root',
  password: '',
  database: 'game',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
