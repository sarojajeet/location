addUser
import express from 'express';
import {
    addUser,
    addJob,


    getJobById,

} from '../controllers/test.controller.js';

const router = express.Router();

router.post('/create/user', addUser);
router.post('/create/jobs', addJob);


router.get('/get-job/:id', getJobById);



export default router;


