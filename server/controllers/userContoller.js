const pool = require('../connection/database');
const bcrypt = require('bcryptjs');
const catchAsyncError = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/errorhandler');
const {generatedToken, generatedTokenTwo} = require('../utils/jwtToken')
const {setTokenCookie, setTokenCookieTwo} = require('../utils/sendToken')




// Create a function to insert a new buyer into the users table
const createUser = async (req, res, next) => {
  
    const { firstname, lastname, username, email, age, country, phoneno, password} = req.body;

      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

    try{
        
        // Get a connection from the pool
        const connection = await pool.getConnection();


        const [usernameResult] = await connection.execute(
          `SELECT * FROM user WHERE username = ?`,
          [username]
        );
        const [phoneResult] = await connection.execute(
          `SELECT * FROM user WHERE phoneno = ?`,
          [phoneno]
        );
        const [emailResult] = await connection.execute(
          `SELECT * FROM user WHERE email = ?`,
          [email]
        );
        
        if (usernameResult.length > 0) {
          return next(new ErrorHandler('Username already in use', 400));
        }
        console.log('Username already in use');
        
        if (phoneResult.length > 0) {
          return next(new ErrorHandler('Phone number already in use', 400));
        }
        console.log('Phone number already in use');
        
        if (emailResult.length > 0) {
          return next(new ErrorHandler('Email already in use', 400));
        }
        console.log('Email already in use');
        
      
        // Insert a new buyer into the users table
        const [result] = await connection.execute(
          `INSERT INTO user (firstname, lastname, username, email, age, country, phoneno, password) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [firstname, lastname, username, email, age, country, phoneno, hashedPassword]
        );

        const [accountInfo] = await connection.execute(
          `INSERT INTO accountinfo (userid, firstname, lastname, email, country) VALUES(?, ?, ?, ?, ?)`,
          [result.insertId, firstname, lastname, email, country,]
        )

        const [profile] = await connection.execute(
          `INSERT INTO profile (userid, username) VALUES(?, ?)`,
          [result.insertId, username]
        )

        
        //wallet creation
        const total_amount = 0
         
        // add amount to wallet
        const [wallet] = await connection.execute(
          `INSERT INTO wallet (userid, username, total_amount) 
          VALUES (?, ?, ?)`,
          [result.insertId, username, total_amount]
        );



        connection.release();

        console.log(`User with username ${username} created successfully`);

      
        // Create JWT token and with user ID
        const userid = result.insertId;
        const userEmail = email
        const token = generatedToken(userid, username, userEmail)
        // set cookie
        setTokenCookie(res, token);

        const createUser = {
          id: result.insertId,
          firstname: firstname,
          lastname:lastname, 
          username:username, 
          email:email, 
          age:age, 
          country:country, 
          phoneno:phoneno, 
          hashedPassword: hashedPassword
        }

        const account_Info={
          id: result.insertId,
          firstname:firstname,
          lastname:lastname,
          email:email,
          country:country,
        }

        // end
        res.status(201).json({
          success: true,
          message: "User with username ${username} created successfully",
          createUser: createUser,
          accountInfo: account_Info, 
          profile: profile,
          token: token,
          wallet
        });

   
  } catch(err){
    console.error('Error creating User: ', err);
    return next(new ErrorHandler('Internal Server Error', 500));
  }

};




const loginUser = catchAsyncError(async (req, res, next) => {

  const {email, password} = req.body;

  try{

    // Get a connection from the pool
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.execute(
      `SELECT * FROM user WHERE email = ?`,
      [email]
    );
    
    // Check if the user exists in the database
    if (rows.length === 0) {
      return next(new ErrorHandler('Invalid email', 400));
    }

    // Compare the stored password hash with the provided password
    const storedPasswordHash = rows[0].password;
    const passwordMatches = await bcrypt.compare(password, storedPasswordHash);

    if (!passwordMatches) {
      return next(new ErrorHandler('Invalid Password', 401));
    }


    console.log(`User loggedin successfully`);

    // Query the collection table to get suserid and buserid
    const [collectionRows, collectionFields] = await connection.execute(
      `SELECT * FROM collection WHERE userid = ?`,
      [rows[0].userid]
    );
    

    let suserid = null;
    let buserid = null;

    if (collectionRows.length > 0) {
      suserid = collectionRows[0].suserid;
      buserid = collectionRows[0].buserid;
      
    }
    

    connection.release();

     // Create JWT token and with user ID
      const  userid = rows[0].userid;
      const username = rows[0].username;
      const userEmail = rows[0].email;
  
      const token = generatedToken(userid, username, userEmail);
      const data = generatedTokenTwo(userid, username, userEmail, buserid, suserid);

      // set cookie
      setTokenCookie(res, token);
      setTokenCookieTwo(res, data);

      // const decodedtoken = jwt.decode(data)

      res.status(201).json({
        success: true,
        message: `Hi ${rows[0].username} iam logged In`,
        token,
        data,
      });

  }catch(err){
    console.error('Error logging User: ', err);
    return next(new ErrorHandler('Internal Server Error', 500));
  }

});


const getUser = async(req, res, next) => {

  try {
    
    const userid = req.user.userid;

    const connection = await pool.getConnection();

    const [avatar] = await connection.execute('SELECT * FROM avatar WHERE userid = ?', [userid])

    const [name] = await connection.execute('SELECT * FROM user WHERE userid = ?', [userid])

    const user = {
      name: name[0].username,
      profileImage: null
    }

    if (avatar.length > 0) {
      user.profileImage = {
        link: `/profileImages/${avatar[0].profilephoto}`,
      };
    }
  

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Profile is retrived',
      user
      
    });


  } catch (error) {
    console.error('Please Login to access: ', err);
    return next(new ErrorHandler('Internal Server Error', 500));
  }

}


const logOut = async (req, res) => {

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.cookie("data", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out"
  });

}

module.exports = {
    createUser,
    loginUser,
    getUser,
    logOut
};