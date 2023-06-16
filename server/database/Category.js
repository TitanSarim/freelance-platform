const { pool } = require('../connection/database');

// Check if category table exists
pool.query(`SHOW TABLES LIKE 'category'`, (err, results) => {
  if (err) {
    console.error('Error checking if  category table exists: ', err);
    
    return;
  }
  
  // If category table exists, do nothing
  if (results.length > 0) {
    console.log('category table already exists');
    
    return;
  }
  
  // Otherwise, create category table
  pool.query(`CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(1000) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`, (err) => {

    if (err) {

      console.error('Error creating category table: ', err);
      return;

    }
    
    console.log('category table created successfully');
    
  });
});
