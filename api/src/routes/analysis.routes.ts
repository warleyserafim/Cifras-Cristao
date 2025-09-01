import { Router } from 'express';
import * as analysisController from '../controllers/analysis.controller';

const router = Router();

router.post('/analyze-music', analysisController.analyzeMusic);

export default router;