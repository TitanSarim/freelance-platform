const { pool } = require('../connection/database');


// Check if subcategories table exists
pool.query(`SHOW TABLES LIKE 'subcategories'`, (err, results) => {
  if (err) {
    console.error('Error checking if  subcategories table exists: ', err);
    
    return;
  }
  
  // If subcategories table exists, do nothing
  if (results.length > 0) {
    console.log('subcategories table already exists');
    
    return;
  }
  
  // Otherwise, create subcategories table
  pool.query(`CREATE TABLE subcategories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    subcategories VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`, (err) => {

    if (err) {

      console.error('Error creating subcategories table: ', err);
      return;

    }
    
    console.log('subcategories table created successfully');
    
  });
});
