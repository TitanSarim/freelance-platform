const { pool } = require('../connection/database');

// Check if buser table exists
pool.query(`SHOW TABLES LIKE 'buser'`, (err, results) => {
  if (err) {
    console.error('Error checking if avatar table exists: ', err);
    
    return;
  }
  
  // If buser table exists, do nothing
  if (results.length > 0) {
    console.log('buser table already exists');
    
    return;
  }
  
  // Otherwise, create buser table
  pool.query(`CREATE TABLE buser (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userid BIGINT NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {

    if (err) {

      console.error('Error creating buser table: ', err);
      return;

    }
    
    console.log('buser table created successfully');
    
  });
});
