import express from 'express';
import { addRecurringBill, getRecurringBills } from '../controllers/recurringController.js';

const router = express.Router();

router.post('/', addRecurringBill);
router.get('/', getRecurringBills);

export default router;
