const { pool } = require('../connection/database');

// Check if suser table exists
pool.query(`SHOW TABLES LIKE 'suser'`, (err, results) => {
  if (err) {
    console.error('Error checking if avatar table exists: ', err);
    
    return;
  }
  
  // If suser table exists, do nothing
  if (results.length > 0) {
    console.log('suser table already exists');
    
    return;
  }
  
  // Otherwise, create suser table
  pool.query(`CREATE TABLE suser (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userid BIGINT NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {

    if (err) {

      console.error('Error creating suser table: ', err);
      return;

    }
    
    console.log('suser table created successfully');
    
  });
});
