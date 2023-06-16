const pool = require('../connection/database');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError')


// get account detail
const getWalletDetail = catchAsyncError(async (req, res, next) => {

  const userid = req.user.userid;

  try {

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // add amount to wallet
    const [wallet] = await connection.execute(
      'SELECT wallet_id, userid, buserid, suserid, username, total_amount FROM wallet WHERE userid = ?',
      [userid]
    );

      const walletRows = wallet[0];

      if (!walletRows) {
        return next(new ErrorHandler('walletRows not found', 404));
      }


    connection.release();

    console.log(`Amount Info Retrived`);

    const info = {
      wallet_id: wallet[0].wallet_id,
      userid: wallet[0].userid,
      buserid: wallet[0].buserid,
      suserid: wallet[0].buserid,
      username: wallet[0].username,
      total_amount: wallet[0].total_amount
    }

    // end
    res.status(201).json({
      success: true,
      result: info
    });


    } catch(err){
      console.error('Error Getting wallet info: ', err);
      return next(new ErrorHandler('Internal Server Error', 500));
    }

})

// Create a function to create a wallet
const addMoney = catchAsyncError(async (req, res, next) => {
  
    const {total_amount} = req.body;

    const userid = req.user.userid;

    
    try{
        
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // add amount to wallet
        const [wallet] = await connection.execute(
          'UPDATE wallet SET total_amount = IFNULL(?, total_amount) WHERE userid = ?',
          [total_amount || null, userid]
        )


        connection.release();

        console.log(`Amount deposited Successfully`);

        // end
        res.status(201).json({
          success: true,
          wallet
        });

   
  } catch(err){
    console.error('Error Desposting Amount in Wallet: ', err);
    return next(new ErrorHandler('Internal Server Error', 500));
  }

});



module.exports = {
  addMoney, getWalletDetail
};