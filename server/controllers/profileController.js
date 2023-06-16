const pool = require('../connection/database');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError')



// --seller
const getProfile = catchAsyncError(async(req, res, next) => {

    try {

        const userid = req.user.userid;
    

        const connection = await pool.getConnection();

        const [avatar] = await connection.execute('SELECT * FROM avatar WHERE userid = ?', [userid])
        const [profile] = await connection.execute('SELECT * FROM profile WHERE userid = ?', [userid])
        const [wallet] = await connection.execute('SELECT * FROM wallet WHERE userid = ?', [userid])
        const [userDetials] = await connection.execute('SELECT * FROM accountinfo WHERE userid = ?', [userid])
        const [sellorders] = await connection.execute('SELECT * FROM orders WHERE to_userid = ?', [userid])
        const [buyorders] = await connection.execute('SELECT * FROM orders WHERE from_userid = ?', [userid])

        connection.release();

        if (!profile.length && !userDetials.length) {
            return next(new ErrorHandler('Profile not found', 404));
        }

        const sellOrderResults = sellorders.map((order)=> ({
            order_id: order.order_id,
            from_userid: order.from_userid,
            from_username: order.from_username,
            to_userid: order.to_userid,
            to_username: order.to_username,
            projectid: order.projectid,
            type: order.type,
            days: order.days,
            revisons: order.revisons,
            requirements: order.requirements,
            reviews: order.reviews,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            late_delivery: order.late_delivery
        }))

        const buyOrderResults = buyorders.map((order)=> ({
            order_id: order.order_id,
            from_userid: order.from_userid,
            from_username: order.from_username,
            to_userid: order.to_userid,
            to_username: order.to_username,
            projectid: order.projectid,
            type: order.type,
            days: order.days,
            revisons: order.revisons,
            requirements: order.requirements,
            reviews: order.reviews,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            late_delivery: order.late_delivery
        }))


        const result = {
            id: profile[0].id,
            userid: profile[0].userid,
            suserid: profile[0].suserid,
            buserid: profile[0].buserid,
            username: profile[0].username,
            profileImage: null,
            quote: profile[0].quote,
            description: profile[0].description,
            skills: JSON.parse(profile[0].skills),
            education: JSON.parse(profile[0].education),
            certificated: JSON.parse(profile[0].certificated),
            language: JSON.parse(profile[0].language),
            amount: wallet[0].total_amount,
            address1: userDetials[0].address1,
            address2: userDetials[0].address2,
            country: userDetials[0].country,
            city: userDetials[0].includes,
            status: userDetials[0].status,
            joined: userDetials[0].createdAt,
            sellOrderResults: sellOrderResults,
            buyOrderResults: buyOrderResults
        }

        if (avatar.length > 0) {
            result.profileImage = {
              link: `/profileImages/${avatar[0].profilephoto}`,
            };
        }

        res.status(200).json({
            success: true,
            message: 'Profile is Retrieved',
            result
        })


    } catch (error) {
        console.log('Error in retrieving profile: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

})

// update project --seller
const updateProfile =  catchAsyncError (async(req, res, next) => {
    
    try {

        const {quote, description, skills, education, certificated, language} = req.body;
        const userid = req.user.userid;
        
        const connection = await pool.getConnection();

        const [profile] = await connection.execute(
            `UPDATE profile SET quote = IFNULL(?, quote), description = IFNULL(?, description), skills = IFNULL(?, skills), education = IFNULL(?, education), certificated = IFNULL(?, certificated), language = IFNULL(?, language) WHERE userid = ?`,
            [quote || null,  description|| null, JSON.stringify(skills)|| null, JSON.stringify(education)|| null, JSON.stringify(certificated)|| null, JSON.stringify(language)|| null, userid]
        )
         
        connection.release();
            
        return res.status(200).json({
            success: true,
            message: "Account information updated successfully",
            updatedprofile: profile
        });
        
        

    } catch (error) {
        console.log('Error in updating account information: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

});

// --user
const getSellerDetail = catchAsyncError(async(req, res, next) => {

    try {

        const userid = req.params.id;

        const connection = await pool.getConnection();

        const [profile] = await connection.execute('SELECT * FROM profile WHERE userid = ?', [userid])
        const [projects] = await connection.execute('SELECT * FROM project WHERE userid = ?', [userid])

        if (!profile.length) {
            return next(new ErrorHandler('Profile not found', 404));
        }

        const result = {
            id: profile[0].id,
            userid: profile[0].userid,
            suserid: profile[0].suserid,
            buserid: profile[0].buserid,
            username: profile[0].username,
            quote: profile[0].quote,
            description: profile[0].description,
            skills: JSON.parse(profile[0].skills),
            education: JSON.parse(profile[0].education),
            certificated: JSON.parse(profile[0].certificated),
            language: JSON.parse(profile[0].language),
        }

        const projectInfoArray = projects.map((row) => {
            return {
                id: row.projectid,
                userid: row.userid, 
                suserid: row.suserid, 
                heading: row.heading,
                images: JSON.parse(row.images)
            }
        });


        res.status(200).json({
            success: true,
            message: 'Profile is Retrieved',
            info: result,
            projects: projectInfoArray,
            
        })


    } catch (error) {
        console.log('Error in retrieving profile: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

})



module.exports = {getProfile, updateProfile, getSellerDetail}


// const projectid = req.params.id;
