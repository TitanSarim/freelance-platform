const jwt  = require("jsonwebtoken");
const catchAsyncError = require("./catchAsyncError");
const ErrorHandler = require("../utils/errorhandler")
const pool = require('../connection/database');

const userData = catchAsyncError(async(req, res, next) =>{

    const data = req.cookies.data;
    
    if(!data){
        console.log('data didnt received');
        return next(new ErrorHandler("Please login to access this resource", 401))
    }else{
        console.log('data received:', data);
    }

    try {

      const decodedData = jwt.verify(data, process.env.JWT_SECRET);

      // console.log(decodedData);

      const connection = await pool.getConnection();

      const [collection] = await connection.execute('SELECT userid, username, email, suserid, buserid FROM collection WHERE userid = ?', [decodedData.userid]);
      if (!collection) {
        return next(new ErrorHandler("User Data Not Found", 401))
      }
  

      const userData = {
        userid: collection[0]?.userid,
        username: collection[0]?.username,
        userEmail: collection[0]?.email,
        suserid: collection[0]?.suserid,
        buserid: collection[0]?.buserid,
      };
    
      
      req.user = userData;
      next();
      connection.release();

    } catch (error) {
      console.error('Error while executing database query:', error.message);
      return next(new ErrorHandler("Unable to login", 403))
    }

    

});


module.exports = {
  userData,
}