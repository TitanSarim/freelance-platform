const { pool } = require('../connection/database');

// Check if avatar table exists
pool.query(`SHOW TABLES LIKE 'avatar'`, (err, results) => {
  if (err) {
    console.error('Error checking if avatar table exists: ', err);
    
    return;
  }
  
  // If avatar table exists, do nothing
  if (results.length > 0) {
    console.log('avatar table already exists');
    
    return;
  }
  
  // Otherwise, create avatar table
  pool.query(`CREATE TABLE avatar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userid BIGINT NOT NULL UNIQUE,
    profilephoto VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {

    if (err) {

      console.error('Error creating avatar table: ', err);
      return;

    }
    
    console.log('avatar table created successfully');
    
  });
});
