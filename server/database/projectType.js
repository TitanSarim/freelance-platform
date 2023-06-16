const { pool } = require('../connection/database');

// Check if projecttype table exists
pool.query(`SHOW TABLES LIKE 'projecttype'`, (err, results) => {
  if (err) {
    console.error('Error checking if projecttype table exists: ', err);
    
    return;
  }
  
  // If projecttype table exists, do nothing
  if (results.length > 0) {
    console.log('projecttype table already exists');
    
    return;
  }
  
  // Otherwise, create projecttype table
  pool.query(`CREATE TABLE projecttype (
    projecttypeid INT PRIMARY KEY AUTO_INCREMENT,
    userid BIGINT NOT NULL,
    suserid BIGINT NOT NULL,
    projectid BIGINT NOT NULL,
    type VARCHAR(255) NOT NULL,
    quote VARCHAR(255) NOT NULL,
    price BIGINT NOT NULL,
    serviceone VARCHAR(255) NOT NULL,
    servicetwo VARCHAR(255) NOT NULL,
    servicethree VARCHAR(255) NOT NULL,
    servicefour VARCHAR(255) NOT NULL,
    deliverydays BIGINT NOT NULL,
    revisions BIGINT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {

    if (err) {

      console.error('Error creating projecttype table: ', err);
      return;

    }
    
    console.log('projecttype table created successfully');
    
  });
});
