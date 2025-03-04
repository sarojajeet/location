
import express from 'express';
import {
    getNearJobs,
    acceptJob,
    addWorker,
    updatingWorkerType,
    getAcceptedJobsByWorker ,
    registerWorkerStep3,
    getWorkerById,
    verifyContractor,
    verifyReferralBonus
} from '../controllers/worker.controller.js';
import upload from '../middleware/multer.middleware.js';

const router = express.Router();

router.post('/add-worker', addWorker);
router.post('/add-worker-type', updatingWorkerType);
router.post('/verify-contractor', verifyContractor);
router.post('/add/worker-kyc', 
    upload.fields([
      { name: 'aadhaarCardImage', maxCount: 1 },
      { name: 'panCardImage', maxCount: 1 },
      { name: 'selfie', maxCount: 1 },
    ]), 
    registerWorkerStep3
  );
  router.get('/get-worker/:id', getWorkerById);
router.get('/jobs/nearby', getNearJobs);
router.get('/accept-jobs', acceptJob);
router.get('/get-job-by-worker/:workerId ', getAcceptedJobsByWorker);
router.get('/verify-refferal', verifyReferralBonus);
export default router;


