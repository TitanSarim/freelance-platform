const { pool } = require('../connection/database');

// Check if accountinfo table exists
pool.query(`SHOW TABLES LIKE 'accountinfo'`, (err, results) => {
  if (err) {
    console.error('Error checking if  accountinfo table exists: ', err);
    
    return;
  }
  
  // If accountinfo table exists, do nothing
  if (results.length > 0) {
    console.log('accountinfo table already exists');
    
    return;
  }
  
  // Otherwise, create accountinfo table
  pool.query(`CREATE TABLE accountinfo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userid BIGINT NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    country VARCHAR(255) NOT NULL,
    nic VARCHAR(255),
    status VARCHAR(255) DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {

    if (err) {

      console.error('Error creating accountinfo table: ', err);
      return;

    }
    
    console.log('accountinfo table created successfully');
    
  });
});
