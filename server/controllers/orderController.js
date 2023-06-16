const pool = require('../connection/database');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError')
const {sendEmailAlert } = require('../notification/newOrderMail');
const {orderDeliverEmailAlert} = require('../notification/orderDeliveredMail');
const {ordercancelEmailAlert} = require('../notification/orderCancelRequestEmail');
const {ordercanceledEmailAlert} = require('../notification/orderCanceledEmail');
const {askForRevisionEmailAlert} = require("../notification/askForRevisionEmail");
const {orderApprovedEmailAlert} = require("../notification/orderApprovedEmail");
const calculateTimeLeft = require('../utils/TimeLeftFunction')
const amqp = require('amqplib');





const createOrder = catchAsyncError(async(req, res, next) => {

    try {

        const buyer_id = req.user.userid;
        const buyer_name = req.user.username;
        const buyer_email = req.user.userEmail;
        const { projectid, type, requirements, attachments} = req.body;

        const connection = await pool.getConnection();

        // ? collecting seller info
        const [project] = await connection.execute(
            'SELECT userid FROM projecttype WHERE projectid = ?',
            [projectid]
        )

        const [projectHeading] = await connection.execute(
            'SELECT heading FROM project WHERE projectid = ?',
            [projectid]
        )

        const seller_id= project[0].userid
        
        const [sellerName] = await connection.execute(
            'SELECT username, email FROM user WHERE userid = ?',
            [seller_id]
        )    
    
            
        const seller_name = sellerName[0].username
        const seller_email = sellerName[0].email

        console.log(seller_id, seller_name);
        // ? end


        
        // ? check seller didn't create order on his own project
            // check if the seller is not the buyer
            if (seller_id === buyer_id) {
                return res.status(400).json({
                    message: "You cannot create order on your own project"
                });
            }
        // ? end


        // ? collecting project Type info
        const [projectType] = await connection.execute(
            'SELECT * FROM projecttype WHERE projectid = ? AND type = ?',
            [projectid, type]
        );
        
        if (!projectType.length) {
          return res.status(404).json({ message: 'Project type not found' });
        }
        
        const projectTypeResult = {
            heading: projectHeading[0].heading,
            projectId: projectType[0].projectid,
            projecttypeid: projectType[0].projecttypeid,
            type: projectType[0].type,
            price: projectType[0].price,
            days: projectType[0].deliverydays,
            revisions: projectType[0].revisions
        };

        console.log(projectTypeResult);
        // ?end



        // ? check wheater buyer have inough ammount in his wallet or not

        const [checkWalletStatus] = await connection.execute(
            'SELECT total_amount FROM wallet WHERE userid = ? ',
            [buyer_id]
        )

        if (checkWalletStatus[0].total_amount < projectTypeResult.price){
            return res.status(400).json({
                message: "Insufficient Funds"
            });
        }

        // ? end
        



        // ? insert into orders table
        const [insertData] = await connection.execute(
            'INSERT INTO orders (from_userid, from_username, from_userEmail, to_userid, to_username, to_userEmail, projectid, projecttypeid, type, heading, price, days, revisions, requirements, attachments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [buyer_id, buyer_name, buyer_email, seller_id, seller_name, seller_email, projectid, projectType[0].projecttypeid, type, projectTypeResult.heading, projectType[0].price, projectType[0].deliverydays, projectType[0].revisions, requirements, JSON.stringify(attachments)]
        );



        // ? amount deducation and transfering into safe box

        const amountWithTax = projectTypeResult.price * 1.04; // ! adding 4% tax
        const newBuyerBalance = checkWalletStatus[0].total_amount - amountWithTax;
        const [deductBalanace] = await connection.execute(
            'UPDATE wallet SET total_amount = ? WHERE userid = ?',
            [newBuyerBalance, buyer_id]
        )

            // ! transfer money to safebox

            const [adminSafeBox] = await connection.execute(
                'SELECT * FROM wallet WHERE userid = 1 AND suserid = 1 AND buserid = 1 AND wallet_id = 1'
            )

            const adminSafeBoxBalance = adminSafeBox[0].total_amount;
            const newAdminSafeBoxBalance = adminSafeBoxBalance + amountWithTax;

            await connection.execute(
                'UPDATE wallet SET total_amount = ? WHERE userid = 1 AND suserid = 1 AND buserid = 1 AND wallet_id = 1',
                [newAdminSafeBoxBalance]
            );



        // ? end

        connection.release();


        // todo: send email alerts algorithm buyer and seller 
        const buyerEmailText = `Dear ${buyer_name},\n\nYour order for project "${projectTypeResult.heading}" has been successfully created.\n\nThank you for choosing our platform.\n\nBest regards,\n${buyer_name}`;
        const sellerEmailText = `Dear ${seller_name},\n\nYou have received a new order for project "${projectTypeResult.heading}".\n\nPlease log in to your account to view the details.\n\nThank you for choosing our platform.\n\nBest regards,\n${buyer_name}`;
        
        const task = {
            buyerEmail: buyer_email,
            buyerEmailText: buyerEmailText,
            sellerEmail: seller_email,
            sellerEmailText: sellerEmailText,
        }

        async function startWorker() {
            const connection = await amqp.connect('amqp://localhost');
            const channel = await connection.createChannel();
          
            // Define the queue to listen to
            const queueName = 'email_queue';
            await channel.assertQueue(queueName);
          
            // Set up the callback function to execute when a message is received
            channel.consume(queueName, async (msg) => {
              try {
                const task = JSON.parse(msg.content.toString());
                await sendEmailAlert(task.buyerEmail, 'New order created', task.buyerEmailText);
                await sendEmailAlert(task.sellerEmail, 'New order received', task.sellerEmailText);
                channel.ack(msg); // Acknowledge that the message was processed successfully
              } catch (err) {
                console.error('Error processing message:', err);
                channel.nack(msg); // Tell RabbitMQ to requeue the message
              }
            });
          }

        const queue_connection = await amqp.connect('amqp://localhost');
        const channel = await queue_connection.createChannel();
        await channel.assertQueue('email_queue');
        
        // Publish the email task to the queue
        channel.sendToQueue('email_queue', Buffer.from(JSON.stringify(task)));
        console.log('Email task published to the queue');

        // Close the channel and connection
        setTimeout(function() {
            channel.close();
            queue_connection.close();
        }, 15000);

        startWorker();

        // todo: Ends send email alerts algorithm buyer and seller 


        res.status(200).json({
            success: true,
            message: 'Your is created',
            Data: insertData
        })

        

    } catch (error) {
        console.log('Error in creating order: ', error);
        return next(new ErrorHandler('Internal server error', 500));  
    }

})



// get all orders info --seller --buyer
const getAllOrders = catchAsyncError(async(req, res, next) => {


    try {

        const userid = req.user.userid

        const connection = await pool.getConnection()

        const [orders] = await connection.execute(
            'SELECT * FROM orders WHERE from_userid = ? OR to_userid = ?',
            [userid, userid]
        )

        console.log(orders);

        // no order founc
        if(!orders.length){
            return res.status(404).json({ message: 'No orders found' });
        }



        // ? calculate time left for each order
        
        const AllordersWithTimeLeft = calculateTimeLeft(orders)

        // ? end

        connection.release();


        res.status(200).json({
            success: true,
            message: 'All orders retrieved',
            data: AllordersWithTimeLeft
        });


    } catch (error) {
        console.log('Error in getting orders: ', error);
        return next(new ErrorHandler('Internal server error', 500)); 
    }


})


// get one order detail --seller --buyer
const getOrderDetial = catchAsyncError(async(req, res, next) => {


    try {

        const seller_id = req.user.userid;

        const order_id = req.params.id
        console.log(order_id);

        const connection = await pool.getConnection();

        // ? collecting seller info
        const [order] = await connection.execute(
            'SELECT * FROM orders WHERE order_id = ? AND to_userid = ?',
            [order_id, seller_id]
        )

        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderDetailWithTimeLeft = calculateTimeLeft(order)
        console.log(orderDetailWithTimeLeft);

        res.status(200).json({
            success: true,
            message: 'Order info retrieved',
            data: orderDetailWithTimeLeft
        });


    } catch (error) {
        console.log('Error in getting order: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

    connection.release();


})


// Deliver Order --seller 
const OrderDelivered = catchAsyncError(async(req, res, next) => {


    try {

        const seller_id = req.user.userid;
        const seller_name = req.user.username;

        const {order_id, text, files, status} = req.body;
    
        const connection = await pool.getConnection();

        const [order_info] = await connection.execute(
            'SELECT * FROM orders WHERE order_id = ? AND to_userid = ?',
            [order_id, seller_id]
        )        

        const order_data = {
            from_userid: order_info[0].from_userid,
            from_username:order_info[0].from_username,
            from_userEmail:order_info[0].from_userEmail,
            to_userid:order_info[0].to_userid,
            to_username:order_info[0].to_username,
            to_userEmail:order_info[0].to_userEmail,
            title: order_info[0].heading,
            price: order_info[0].price
        }

        if(order_info[0].status === "cancel"){
            return res.status(200).json({ success: true, message: "Order Already Cancelled." });
        }

        // create a new delivery
        const [order_delivery] = await connection.execute('INSERT INTO order_delivery (order_id, from_userid, from_username, from_userEmail, to_userid, to_username, to_userEmail, text, files, status, text_from) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [order_id, order_data.from_userid, order_data.from_username, order_data.from_userEmail, order_data.to_userid, order_data.to_username, order_data.to_userEmail, text, JSON.stringify(files), status, seller_name]
        )
        

        if (status === "delivered") {

            await connection.execute(
                'UPDATE orders SET status = ? WHERE order_id = ? AND from_userid = ? AND to_userid = ?',
                [status, order_id, order_data.from_userid, order_data.to_userid]
            );
    
            // send email 
            const buyerEmailText = `Dear ${order_data.from_username},\n\nYour order for project "${order_data.title}" has been delivered.\n\nPlease login and check your delivery.\n\nBest regards,\n${order_data.from_username}`;
            await orderDeliverEmailAlert(order_data.from_userEmail, 'Order Delivery', buyerEmailText);    

        }else if(status === "cancel"){

            const [admin_wallet] = await connection.execute(
                'SELECT * FROM WALLET WHERE wallet_id = 1 AND userid=1 AND suserid=1 AND buserid=1'
            );

            
            const update_amount_admin = admin_wallet[0].total_amount - order_data.price;

            await connection.execute(
                'UPDATE orders SET status = ? WHERE order_id = ? AND from_userid = ? AND to_userid = ?',
                [status, order_id, order_data.from_userid, order_data.to_userid]
            );

            await connection.execute(
                'UPDATE wallet SET total_amount = ? WHERE wallet_id = 1 AND userid = 1 AND suserid = 1 AND buserid = 1',
                [update_amount_admin]
            )

            await connection.execute(
                'UPDATE wallet SET total_amount = ? WHERE userid = ?',
                [order_data.price, order_data.from_userid]
            );

            const sellerEmailText= `Dear ${order_data.to_username},\n\nYour order for project "${order_data.title}" has been Cancelled.\n\nPlease login and check your order.\n\nBest regards,\n${order_data.from_username}`;
            await ordercanceledEmailAlert(order_data.to_userEmail, 'Order has been cancelled', sellerEmailText);
            const buyerEmailText = `Dear ${order_data.from_username},\n\nYour order for project "${order_data.title}" has been Cancelled.\n\nPlease login and check your order.\n\nBest regards,\n${order_data.to_username}`;
            await ordercanceledEmailAlert(order_data.from_userEmail, 'Order has been cancelled', buyerEmailText);
        }

        connection.release();

        res.status(200).json({
            success: true,
            message: 'Order Update from seller',
            order_delivery: order_delivery,
        });


    } catch (error) {
        console.log('Error in getting order: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }



})



// buyer order opprovetion, askforcancel or asked for revision
const buyerOrderOpprovation = catchAsyncError(async(req, res, next) =>{


    try {

        const buyer_id = req.user.userid;
        const buyer_name = req.user.username;

        const {order_id, text, files, status} = req.body;
    
        const connection = await pool.getConnection();

        const [order_info] = await connection.execute(
            'SELECT * FROM orders WHERE order_id = ? AND from_userid = ?',
            [order_id, buyer_id]
        )
        
        const data = {
            title: order_info[0].heading,
            from_userid: order_info[0].from_userid,
            from_username:order_info[0].from_username,
            from_userEmail:order_info[0].from_userEmail,
            to_userid:order_info[0].to_userid,
            to_username:order_info[0].to_username,
            to_userEmail:order_info[0].to_userEmail,
            revisions: order_info[0].revisions,
            price: order_info[0].price
        }


        if(order_info[0].status === "cancel"){
            return res.status(200).json({ success: true, message: "Order Already Cancelled." });
        }

        // create a new delivery
        const [order_delivery] = await connection.execute('INSERT INTO order_delivery (order_id, from_userid, from_username, from_userEmail, to_userid, to_username, to_userEmail, text, files, status, text_from) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [order_id, data.from_userid, data.from_username, data.from_userEmail, data.to_userid, data.to_username, data.to_userEmail, text, files ? JSON.stringify(files) : null, status, buyer_name]
        )


        

        if(status === "askforrevision"){

            if(data.revisions <= 0){
                return res.status(400).json({ success: false, message: "You don't have any revisions left." });
            }

            const updatedRevisions = data.revisions - 1;
            await connection.execute(
                'UPDATE orders SET status = ?, revisions = ? WHERE order_id = ? AND from_userid = ? AND to_userid = ?',
                [status, updatedRevisions, order_id, data.from_userid, data.to_userid]
            );

            const sellerEmailText = `Dear ${data.to_username},\n\nYour order for project "${data.title}" has been requested for revisions.\n\nPlease login and check your order.\n\nBest regards,\n${data.from_username}`;
            await askForRevisionEmailAlert(data.to_userEmail, 'Order Revision Request', sellerEmailText);

        }else if (status === "approved") {

            await connection.execute(
                'UPDATE orders SET status = ? WHERE order_id = ? AND from_userid = ? AND to_userid = ?',
                [status, order_id, data.from_userid, data.to_userid]
            );

            const sellerEmailText = `Dear ${data.to_username},\n\nYour order for project "${data.title}" has been Approved.\n\nPlease login and check your order.\n\nBest regards,\n${data.from_username}`;
            await orderApprovedEmailAlert(data.to_userEmail, 'Congrats Your Order has been Approved', sellerEmailText);
            
        }else if(status === "askforcancel"){

            await connection.execute(
                'UPDATE orders SET status = ? WHERE order_id = ? AND from_userid = ? AND to_userid = ?',
                [status, order_id, data.from_userid, data.to_userid]
            );

            const sellerEmailText = `Dear ${data.to_username},\n\nYour order for project "${data.title}" has been requested for cancellation.\n\nPlease login and check your order.\n\nBest regards,\n${data.from_username}`;
            await ordercancelEmailAlert(data.to_userEmail, 'Order Cancellation Request', sellerEmailText);

        }

        connection.release();


        res.status(200).json({
            success: true,
            message: 'An update on the order',
            order_delivery: order_delivery,
        });

        
    } catch (error) {
        console.log('Error in getting order: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }


})





// buyer --get all delivery conversation
const buyerDeliveryConversation = catchAsyncError(async(req, res, next) => {

    try {
        const buyer_id = req.user.userid;

        const {order_id} = req.body;
    
        const connection = await pool.getConnection();

        const [conversation] = await connection.execute(
            'SELECT DISTINCT * FROM order_delivery WHERE order_id = ? AND from_userid = ?',
            [order_id, buyer_id]
        )

        connection.release();


        const data = {};

        const record = conversation.map(row => {
          if (row.order_id !== null) {

            const date = new Date(row.createdAt)
            
            const dateString = date.toLocaleString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });

            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // "11:30 AM"

            const dateTime = `${dateString} at ${timeString}`

            if (!data[row.order_id]) {
              data[row.order_id] = [];
            }
        
            data[row.order_id].push({
                id: row.order_id,
                status: row.status,
                text_from: row.text_from,
                text: row.text,
                files: row.files,
                date: dateTime,
            });
        
            return data[row.order_id];
          }
        });
        
        //Create a Set to store unique order IDs
        const orderIds = new Set();

        //Iterate through the data object and filter out duplicates
        const filteredRecord = Object.values(data).filter(conversation => {
            const orderId = conversation[0].order_id;
                if (orderIds.has(orderId)) {
                    return false;
                } else {
                    orderIds.add(orderId);
                    return true;
                }
        });

          
        res.status(200).json({
            success: true,
            message: 'All Conversation retrived',
            data: filteredRecord
        });


    } catch (error) {
        console.log('Error in getting Conversation: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

})



// seller --get all delivery conversation
const sellerDeliveryConversation = catchAsyncError(async(req, res, next) => {

    try {
        const seller_id = req.user.userid;

        const {order_id} = req.body;
    
        const connection = await pool.getConnection();

        const [conversation] = await connection.execute(
            'SELECT DISTINCT * FROM order_delivery WHERE order_id = ? AND to_userid = ?',
            [order_id, seller_id]
        )

        connection.release();


        const data = {};

        const record = conversation.map(row => {
          if (row.order_id !== null) {

            const date = new Date(row.createdAt)
            
            const dateString = date.toLocaleString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });

            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // "11:30 AM"

            const dateTime = `${dateString} at ${timeString}`

            if (!data[row.order_id]) {
              data[row.order_id] = [];
            }
        
            data[row.order_id].push({
                id: row.order_id,
                status: row.status,
                text_from: row.text_from,
                text: row.text,
                files: row.files,
                date: dateTime,
            });
        
            return data[row.order_id];
          }
        });
        
        //Create a Set to store unique order IDs
        const orderIds = new Set();

        //Iterate through the data object and filter out duplicates
        const filteredRecord = Object.values(data).filter(conversation => {
            const orderId = conversation[0].order_id;
                if (orderIds.has(orderId)) {
                    return false;
                } else {
                    orderIds.add(orderId);
                    return true;
                }
        });

          
        res.status(200).json({
            success: true,
            message: 'All Conversation retrived',
            data: filteredRecord
        });


    } catch (error) {
        console.log('Error in getting Conversation: ', error);
        return next(new ErrorHandler('Internal server error', 500));
    }

})




module.exports = {createOrder, getAllOrders, getOrderDetial, OrderDelivered, buyerOrderOpprovation, buyerDeliveryConversation, sellerDeliveryConversation}