const { pool } = require('../connection/database');

// Check if Collection table exists
pool.query(`SHOW TABLES LIKE 'Collection'`, (err, results) => {
  if (err) {
    console.error('Error checking if Collection table exists: ', err);
    
    return;
  }
  
  // If Collection table exists, do nothing
  if (results.length > 0) {
    console.log('Collection table already exists');
    
    return;
  }
  
  // Otherwise, create Collection table
  pool.query(`CREATE TABLE Collection (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userid BIGINT NOT NULL,
    suserid BIGINT,
    buserid BIGINT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {

    if (err) {

      console.error('Error creating Collection table: ', err);
      return;

    }
    
    console.log('Collection table created successfully');
    
  });
});
