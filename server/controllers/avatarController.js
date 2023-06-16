const { v4: uuidv4 } = require('uuid');
const pool = require('../connection/database');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError')
const fs = require('fs');
const path = require('path');

// todo: Create a function to insert a avatar into the avatar table
const createUserAvatar =  catchAsyncError (async(req, res, next) => {

  try {
    const userid = req.user.userid;
    if (!req.files) {
      throw new Error('No avatar uploaded');
    }

    // ? Getting uploaded file to local storage
    
    const file = req.files.profilephoto;


    // todo Algorithm convert file to buffer for duplication checking
    
    const imgFile = req.files.profilephoto;
    const uploadedImage = imgFile.data;
    const avatarDir = path.join(__dirname, '..', 'profileImages');
    const  existingAvatars = fs.readdirSync(avatarDir);
    
    for (const avatar of existingAvatars){
      const avatarPath = path.join(avatarDir, avatar);

      const existingImages = fs.readFileSync(avatarPath);

      if(Buffer.compare(existingImages, uploadedImage) === 0){
        return res.status(409).json({error: 'Warning you used Copy Image'});
      }

    }
    // todo: Algorithm duplication checking ends

    // ? Rename thfe ile
    const filename = uuidv4()+Date.now()+'_'+file.name; // ? add current timestamp to the filename
    console.log(filename);

    
    // ? save the Rename file 
    file.mv(`./server/profileImages/${filename}`, (error) => {
      if (error) {
        console.error(error);
        throw new Error('Error saving file');
      }
    });

    //?  Insert the file path into the profilephoto column of your database table
    const sql = 'INSERT INTO avatar (userid, profilephoto) VALUES (?, ?)';
    const values = [userid, filename];
    await pool.query(sql, values);

    res.status(201).send({ message: 'Avatar uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }


   
});



// todo: Create a function to get avatar image and userid
const getUserProfile =  catchAsyncError (async(req, res, next) => {

  try {
    const userid = req.user.userid;
    if (!userid) {
      throw new Error('Please Login to access');
    }


    // TODO:  Insert the file path into the profilephoto column of your database table
    const sql = 'SELECT profilephoto FROM avatar Where userid = ?';
    const [row] = await pool.query(sql, userid);
    const filename = row[0].profilephoto;

    // read the file from the filepath system and send it as a response
    const filePath = path.join(__dirname, '../profileImages/', filename);
    const readStream = fs.readFileSync(filePath);
    const base64Image = Buffer.from(readStream).toString('base64');
   

    // extract image format from filename
    const format = filename.split('.').pop();
   
    // create a data URI for the image
    const dataURI = `data:image/${format};base64,${base64Image}`;

    // send base64 incoded image
    res.send({id: userid, avatar: dataURI}, )

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }


   
});

module.exports = {createUserAvatar, getUserProfile}

