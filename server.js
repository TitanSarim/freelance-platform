const app = require("./server/app.js");
const dotenv = require("dotenv");


// handling uncought Exception
process.on("uncaughtException", (err) =>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);

})


// config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({path:"server/config.env"})
};

//databases
require('./server/database/user');
require('./server/database/avatar');
require('./server/database/accountType');
require('./server/database/suser');
require('./server/database/buser');
require('./server/database/collection');
require('./server/database/project');
require('./server/database/projectType');
require('./server/database/profile');
require('./server/database/account_info');
require('./server/database/wallet');
require('./server/database/order');
require('./server/database/orderDelivery.js');
require('./server/database/Category.js');
require('./server/database/SubCategories.js');

// assigning port to server
const server = app.listen(process.env.PORT, ()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`);
});


// unhandled promise rejaection
process.on("unhandledRejection", err =>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() =>{
        process.exit(1);
    })

})