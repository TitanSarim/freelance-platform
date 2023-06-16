const jwt = require('jsonwebtoken');

const generatedToken = (userid, username, userEmail) => {

    const token = jwt.sign({userid, username, userEmail}, process.env.JWT_SECRET, { expiresIn: '7d' });

    return token;
}

const generatedTokenTwo = (userid, username, userEmail, buserid, suserid) =>{
    
    const token = jwt.sign({userid, username, userEmail, buserid, suserid}, process.env.JWT_SECRET, {expiresIn: '7d'});

    return token;

}

module.exports = {generatedToken, generatedTokenTwo}

