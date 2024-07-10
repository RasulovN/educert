const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth');

async function checkUser(req, res, next) {
    // const token = req.headers['authorization'];
       const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await Auth.findById(decoded.user.id).select('-password'); // Exclude password from selection

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
}


const isAuth = (req, res, next) => {
    if(req.session.isLogged) {
        console.log('kirilgan');
        return res.redirect('/')
    }
    next()
}


module.exports = {
    isAuth,
    checkUser
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