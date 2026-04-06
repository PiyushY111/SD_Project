import express from 'express';
import { addEarning, getEarnings } from '../controllers/earningController.js';

const router = express.Router();

router.post('/', addEarning);
router.get('/', getEarnings);

export default router;
