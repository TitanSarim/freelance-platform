function setTokenCookie(res, token) {

    const options = {

      expires: new Date(

        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000

      ),

      httpOnly: true

    };

    res.cookie('token', token, options);
    
  }
  
  function setTokenCookieTwo(res, data) {

    const options = {

      expires: new Date(

        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000

      ),

      httpOnly: true

    };

    res.cookie('data', data, options);
    
  }

  module.exports = {setTokenCookie, setTokenCookieTwo};