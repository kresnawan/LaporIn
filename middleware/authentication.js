import jwt from 'jsonwebtoken';
import 'dotenv/config'
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;

export const authenticateToken = (mustLoggedIn) => {
    return (req, res, next) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken && !mustLoggedIn) {
            return next();
        }
        
        try {
            const accessToken = req.headers.authorization.split(" ")[1];

            jwt.verify(accessToken, accessTokenKey, (err, user) => {

                req.userId = user.userId;
                req.userRole = user.userRole;

                next();
            });
        } catch (error) {
                return res.status(401).send();
        }
    }
}