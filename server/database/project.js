const { pool } = require('../connection/database');

// Check if project table exists
pool.query(`SHOW TABLES LIKE 'project'`, (err, results) => {
  if (err) {
    console.error('Error checking if project table exists: ', err);
    
    return;
  }
  
  // If project table exists, do nothing
  if (results.length > 0) {
    console.log('project table already exists');
    
    return;
  }
  
  // Otherwise, create project table
  pool.query(`CREATE TABLE project (
    projectid INT PRIMARY KEY AUTO_INCREMENT,
    userid BIGINT NOT NULL,
    suserid BIGINT NOT NULL,
    heading VARCHAR(500) NOT NULL,
    category JSON NOT NULL,
    subcategory JSON NOT NULL,
    description VARCHAR(10000) NOT NULL,
    tags JSON NOT NULL,
    images JSON NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {

    if (err) {

      console.error('Error creating project table: ', err);
      return;

    }
    
    console.log('project table created successfully');
    
  });
});
