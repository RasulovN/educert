const isAuth = (req, res, next) => {
    if(req.session.isLogged) {
        console.log('kirilgan');
        return res.redirect('/')
    }
    next()
}


module.exports = {
    isAuth
}

// const jwt = require('jsonwebtoken');

// const isAuth = (req, res, next) => {
//     // Check for token in headers
//     const token = req.header('x-auth-token');

//     // Token not found
//     if (!token) {
//         return res.status(401).json({ message: 'Authorization denied. No token provided.' });
//     }

//     try {
//         // Verify token
//         const decoded = jwt.verify(token, 'secretkey');
//         req.user = decoded.user; // Set user property in request object
//         next(); // Move to next middleware or route handler
//     } catch (error) {
//         console.error(error.message);
//         res.status(401).json({ message: 'Token is not valid.' });
//     }
// };

// module.exports = isAuth;