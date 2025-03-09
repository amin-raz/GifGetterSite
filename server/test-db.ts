import pool from './db';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful!');
    console.log('Current timestamp from database:', result.rows[0].now);
    await pool.end();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();
