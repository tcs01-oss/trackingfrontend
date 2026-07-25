const pool = require('../../config/database');
const fs = require('fs');
const csv = require('csv-parser');

// Ensure table exists
const ensureTableQuery = `
  CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

async function ensureTable() {
  try {
    await pool.query(ensureTableQuery);
  } catch (error) {
    console.error('Error ensuring contacts table exists:', error);
  }
}

// Call ensureTable immediately
ensureTable();

exports.getContacts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

exports.importContacts = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      // Delete the file after parsing
      fs.unlinkSync(filePath);

      if (results.length === 0) {
        return res.status(400).json({ error: 'CSV file is empty' });
      }

      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // Headers: full_name, contact_number, address
        // Also support "Full Name", "Contact Number", "Address"
        const values = results.map(row => {
            const fullName = row.full_name || row['Full Name'] || row['full name'] || '';
            const contactNumber = row.contact_number || row['Contact Number'] || row['contact number'] || '';
            const address = row.address || row['Address'] || '';
            return [fullName, contactNumber, address];
        }).filter(v => v[0] || v[1]); // Filter empty rows

        if (values.length > 0) {
          await connection.query(
            'INSERT INTO contacts (full_name, contact_number, address) VALUES ?',
            [values]
          );
        }

        await connection.commit();
        res.status(201).json({ message: `Successfully imported ${values.length} contacts` });
      } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Failed to import contacts' });
      } finally {
        connection.release();
      }
    })
    .on('error', (error) => {
      console.error(error);
      res.status(500).json({ error: 'Error parsing CSV file' });
    });
};
