import express from 'express';
import { addGoal, getGoals } from '../controllers/goalController.js';

const router = express.Router();

router.post('/', addGoal);
router.get('/', getGoals);

export default router;
