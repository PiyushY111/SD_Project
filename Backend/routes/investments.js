import express from 'express';
import { addInvestment, getInvestments } from '../controllers/investmentController.js';

const router = express.Router();

router.post('/', addInvestment);
router.get('/', getInvestments);

export default router;
