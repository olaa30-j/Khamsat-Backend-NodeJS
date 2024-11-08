import jwt from 'jsonwebtoken';
import util from 'util';

// --------------------------------------------------------------------------------------------------- // 
// config authorization
export const verfiyToken = async (req, res, next) =>{
    let token = req.headers.authorization;
    if(!token){
        return res.status(401).send({message: 'Access denied. No token provided.'});
    }
    try {
        let decoded = await util.promisify(jwt.verify)(token, process.env.SECRET_KEY);
        req.user = decoded
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Access denied. Invalid token' });
    }
}

// --------------------------------------------------------------------------------------------------- // 
// cookies authorization

export const authenticateUser = (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization;
    if (!token) {
        return res.status(401).send({ message: 'User not authenticated.' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Invalid token.' });
        }

        req.user = decoded; 
        next();
    });
};

export const checkRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user.role) {
            return res.status(401).send({ message: 'User not authorized to perform this action. Check user role' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ message: 'Invalid Access' });
        }

        next();
    }
}
