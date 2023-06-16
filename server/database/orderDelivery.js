const { pool } = require('../connection/database');


// Check if order table exists
pool.query(`SHOW TABLES LIKE 'order_delivery'`, (err, results) => {
  if (err) {
    console.error('Error checking if order_delivery table exists: ', err);
    
    return;
  }
  
  // If order table exists, do nothing
  if (results.length > 0) {
    console.log('order_delivery table already exists');
    
    return;
  }
  
  // Otherwise, create order table
  pool.query(`CREATE TABLE order_delivery (
    order_delivery_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id  BIGINT NOT NULL,
    from_userid BIGINT NOT NULL,
    from_username VARCHAR(255) NOT NULL,
    from_userEmail VARCHAR(255) NOT NULL,
    to_userid BIGINT NOT NULL,
    to_username VARCHAR(255) NOT NULL,
    to_userEmail VARCHAR(255) NOT NULL,
    text VARCHAR(255) NOT NULL,
    files JSON NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {

    if (err) {

      console.error('Error creating order_delivery table: ', err);
      return;

    }
    
    console.log('orders table order_delivery successfully');
    
  });
});
