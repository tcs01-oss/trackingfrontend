const mysql = require('../backend/node_modules/mysql2/promise');

async function check() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tracking'
    });

    console.log('Connected to database.');

    const [rows] = await connection.execute('DESCRIBE tracking_updates');
    console.log('Schema for tracking_updates:');
    rows.forEach(row => {
        console.log(`${row.Field}: ${row.Type} (Null: ${row.Null})`);
    });
    
    await connection.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

check();