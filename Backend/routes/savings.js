import express from 'express';
import { setMonthlySavings, getMonthlySavings } from '../controllers/savingsController.js';

const router = express.Router();

router.post('/', setMonthlySavings);
router.get('/:month', getMonthlySavings);

export default router;
