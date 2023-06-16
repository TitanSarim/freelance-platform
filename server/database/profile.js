const { pool } = require('../connection/database');

// Check if profile table exists
pool.query(`SHOW TABLES LIKE 'profile'`, (err, results) => {
  if (err) {
    console.error('Error checking if  profile table exists: ', err);
    
    return;
  }
  
  // If profile table exists, do nothing
  if (results.length > 0) {
    console.log('profile table already exists');
    
    return;
  }
  
  // Otherwise, create profile table
  pool.query(`CREATE TABLE profile (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userid BIGINT NOT NULL,
    suserid BIGINT,
    buserid BIGINT,
    username VARCHAR(255) NOT NULL,
    quote VARCHAR(255) DEFAULT NULL,
    description VARCHAR(9000) DEFAULT NULL,
    skills JSON DEFAULT NULL,
    education JSON DEFAULT NULL,
    certificated JSON DEFAULT NULL,
    language JSON DEFAULT NULL,
    level VARCHAR(255) DEFAULT NULL,  
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    response_rate BIGINT DEFAULT NULL,
    project_success BIGINT DEFAULT NULL,
    language_control VARCHAR(255) DEFAULT 'BASIC',
  )`, (err) => {

    if (err) {

      console.error('Error creating profile table: ', err);
      return;

    }
    
    console.log('profile table created successfully');
    
  });
});
