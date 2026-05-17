import express from 'express';
import authRoute from './routes/auth.js';
import articleRoute from './routes/article.js';
import commentRoute from './routes/comment.js';
import reportRoute from './routes/report.js';
import userRoute from './routes/user.js';

import path from 'path';
import categoryRoute from './routes/category.js';
import { authenticateToken } from './middleware/authentication.js';

const router = express.Router();

router.use('/comment', commentRoute);
router.use('/article', articleRoute);
router.use('/auth', authRoute);
router.use('/report', reportRoute);
router.use('/category', categoryRoute);
router.use('/user', userRoute);

router.get('/ping', authenticateToken(true), (req, res) => {
    res.status(200).send();
});


router.use('/uploads/article', express.static(path.resolve('article_images')));
router.use('/uploads/report', express.static(path.resolve('report_images')));

export default router;