import express from 'express';
import authRoute from './routes/auth.js';
import reportRoute from './routes/report.js';
import articleRoute from './routes/article.js';
import commentRoute from './routes/comment.js';

import path from 'path';

const router = express.Router();

router.post('/comment', commentRoute)
router.use('/article', articleRoute);
router.use('/auth', authRoute);
router.use('/report', reportRoute);

router.use('/uploads/article', express.static(path.resolve('article_images')));

export default router;