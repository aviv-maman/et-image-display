import express from 'express';
import searchApi from './search';
const router = express.Router();

router.use('/search', searchApi);

export default router;
