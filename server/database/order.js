const { pool } = require('../connection/database');

// Check if order table exists
pool.query(`SHOW TABLES LIKE 'orders'`, (err, results) => {
  if (err) {
    console.error('Error checking if orders table exists: ', err);
    
    return;
  }
  
  // If order table exists, do nothing
  if (results.length > 0) {
    console.log('orders table already exists');
    
    return;
  }
  
  // Otherwise, create order table
  pool.query(`CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    from_userid BIGINT NOT NULL,
    from_username VARCHAR(255) NOT NULL,
    from_userEmail VARCHAR(255) NOT NULL,
    to_userid BIGINT NOT NULL,
    to_username VARCHAR(255) NOT NULL,
    to_userEmail VARCHAR(255) NOT NULL,
    projectid BIGINT NOT NULL,
    projecttypeid BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL,
    heading VARCHAR(100) NOT NULL,
    price BIGINT NOT NULL,
    days BIGINT NOT NULL,
    revisions BIGINT NOT NULL,
    requirements VARCHAR(6000) NOT NULL,
    attachments JSON NOT NULL,
    reviews VARCHAR(100),
    status VARCHAR(155) DEFAULT 'Inprocess',
    timeleft VARCHAR(300) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 

  )`, (err) => {

    if (err) {

      console.error('Error creating orders table: ', err);
      return;

    }
    
    console.log('orders table created successfully');
    
  });
});
