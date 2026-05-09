import jwt from 'jsonwebtoken';
import 'dotenv/config'
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;

export const authenticateToken = (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];

        if (!accessToken) {
            // return res.status(401).send("Access token tidak ditemukan");
            next();
        }

        jwt.verify(accessToken, accessTokenKey, (err, user) => {
            if (err) {
                // return res.status(401).send("Access token tidak valid");
                next();
            }

            req.userId = user.userId;
            req.userRole = user.userRole;

            next();
        });
    } catch (error) {
        // return res.status(401).send(error);
        next();
    }

}