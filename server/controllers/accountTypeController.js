const pool = require('../connection/database');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError')
const {generatedTokenTwo} = require('../utils/jwtToken')
const {setTokenCookieTwo} = require('../utils/sendToken');

const createAccountType =  catchAsyncError (async(req, res, next) => {

    try {

        const { accounttype } = req.body;
        const userid = req.user.userid;
        const username = req.user.username;
        const email = req.user.userEmail;

        const connection = await pool.getConnection();

        const [result] = await connection.execute('INSERT INTO accounttype (userid, accounttype) VALUES (? , ?)', [userid, accounttype]);


        const accountTypeData = {
            id: result.insertId,
            userid: userid,
            accounttype: accounttype,
        };

        let suserid = null;
        let buserid = null;

        // Insert data into suser table if account type is seller
        if(accounttype === 'seller'){
           const [suserResult] = await connection.execute('INSERT INTO suser (userid, username) VALUES (? , ?)', [userid, username]);

            suserid= suserResult.insertId
        }
        
        if(accounttype === 'buyer'){
            const [buserResult] = await connection.execute('INSERT INTO buser (userid, username) VALUES (? , ?)', [userid, username]);

            buserid= buserResult.insertId
        }

        // create collection
        const [collectionResult] = await connection.execute('SELECT * FROM collection WHERE userid = ?', [userid]);

        // update collection
        if(collectionResult.length>0){

            await connection.execute('UPDATE collection SET suserid = IFNULL(?, suserid), buserid = IFNULL(?, buserid), username = ?, email = ? WHERE userid = ?',
                [suserid || null, buserid || null, username, email, userid]
              );
            
            // fetch the updated values of suserid and buserid
            const [updatedCollection] = await connection.execute('SELECT * FROM collection WHERE userid = ?', [userid]);
            suserid = updatedCollection[0].suserid || null;
            buserid = updatedCollection[0].buserid || null;

        }else{

            await connection.execute('INSERT INTO collection (userid, suserid, buserid, username, email) VALUES (?, ?, ?, ?, ?)', 
            [userid, suserid, buserid, username, email])

        }

        const [profile] = await connection.execute(
            `UPDATE profile SET suserid = IFNULL(?, suserid), buserid = IFNULL(?, buserid), username = ? WHERE userid = ?`,
            [suserid || null, buserid || null, username, userid]
        )  
        
        // wallet
        const [wallet] = await connection.execute(
            'UPDATE wallet SET suserid = IFNULL(?, suserid), buserid = IFNULL(?, buserid)  WHERE userid = ?',
            [suserid || null, buserid || null, userid]
        )


        // Create JWT token and with user ID
        const data = generatedTokenTwo(userid, username, email, buserid, suserid)
        // set cookie
        setTokenCookieTwo(res, data);

        res.status(201).json({
            success: true,
            message: 'account type is created',
            accounttype: accountTypeData,
            data: data,
            profile: profile,
            wallet
        })


        connection.release();

    } catch (error) {
        console.log('Error in creating accounttype: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

});





module.exports = {createAccountType}