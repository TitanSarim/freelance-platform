const { pool } = require('../connection/database');

// Check if accountType table exists
pool.query(`SHOW TABLES LIKE 'accountType'`, (err, results) => {
  if (err) {
    console.error('Error checking if  accountType table exists: ', err);
    
    return;
  }
  
  // If accountType table exists, do nothing
  if (results.length > 0) {
    console.log('accountType table already exists');
    
    return;
  }
  
  // Otherwise, create accountType table
  pool.query(`CREATE TABLE accountType (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userid BIGINT NOT NULL,
    accounttype VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {

    if (err) {

      console.error('Error creating accountType table: ', err);
      return;

    }
    
    console.log('accountType table created successfully');
    
  });
});
