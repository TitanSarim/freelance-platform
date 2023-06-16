const { pool } = require('../connection/database');

// Check if wallet table exists
pool.query(`SHOW TABLES LIKE 'wallet'`, (err, results) => {
  if (err) {
    console.error('Error checking if  wallet table exists: ', err);
    
    return;
  }
  
  // If wallet table exists, do nothing
  if (results.length > 0) {
    console.log('wallet table already exists');
    
    return;
  }
  
  // Otherwise, create wallet table
  pool.query(`CREATE TABLE wallet (
    wallet_id INT PRIMARY KEY AUTO_INCREMENT,
    userid BIGINT NOT NULL,
    suserid BIGINT,
    buserid BIGINT,
    username VARCHAR(255) NOT NULL,
    total_amount BIGINT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {

    if (err) {

      console.error('Error creating wallet table: ', err);
      return;

    }
    
    console.log('wallet table created successfully');
    
  });
});
