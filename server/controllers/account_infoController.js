const pool = require('../connection/database');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError')




const getInfo = catchAsyncError(async(req, res, next) => {

    try {

        const userid = req.user.userid;

        const connection = await pool.getConnection();

        const [accountinfo] = await connection.execute('SELECT * FROM accountinfo WHERE userid = ?', [userid]);

        // if (!accountinfo.length[0]) {
        //     return next(new ErrorHandler('Info not found', 404));
        //   }
        

        const result = {
                userid: accountinfo[0].userid, 
                firstname: accountinfo[0].firstname,
                lastname: accountinfo[0].lastname,
                email: accountinfo[0].email,
                address1: accountinfo[0].address1,
                address2: accountinfo[0].address2,
                country: accountinfo[0].country,
                nic: accountinfo[0].nic,
                status: accountinfo[0].status
        }  

        res.status(200).json({
            success: true,
            message: 'Info is Retrieved',
            info: result
        })


    } catch (error) {
        console.log('Error in retrieving Info: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

})



// update project
const updateInfo =  catchAsyncError (async(req, res, next) => {
    
    try {

        const {firstname, lastname, email, address1, address2, country, nic} = req.body;
        const userid = req.user.userid;
        
        const connection = await pool.getConnection();


         // Check if a row exists for the user
        const [rows] = await connection.execute(
            "SELECT * FROM accountinfo WHERE userid = ?",
            [userid]
        );
            
        if (rows.length === 0) {
            return res.status(400).json({
              success: false,
              message: "No account information found for this user",
            });
        }

        const accountInfo = rows[0];

            // Replace undefined values with null values
            const updatedFirstname = firstname ? firstname : null;
            const updatedLastname = lastname ? lastname : null;
            const updatedEmail = email ? email : null;
            const updatedAddress1 = address1 ? address1 : null;
            const updatedAddress2 = address2 ? address2 : null;
            const updatedCountry = country ? country : null;
            const updatedNic = nic ? nic : null;
        

            // Update the row with the provided data
            const [info] = await connection.execute(
                `UPDATE accountinfo SET firstname=?, lastname=?, email=?, address1=?, address2=?, country=?, nic=? WHERE userid=? AND status='pending'`,
                [updatedFirstname, updatedLastname, updatedEmail, updatedAddress1, updatedAddress2, updatedCountry, updatedNic, userid]
            );

            connection.release();
            
            return res.status(200).json({
                success: true,
                message: "Account information updated successfully",
                updatedinfo: info
            });
        
          
               

    } catch (error) {
        console.log('Error in updating account information: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

});



module.exports = {getInfo, updateInfo}