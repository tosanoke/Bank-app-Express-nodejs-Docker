import express from 'express';
const router = express.Router();
import {getAllBalance, getUserBalance, createAccount, transfer} from '../controllers/controller';
import {validate, balanceSchema, transferSchema} from '../validation/schema'


router.get('/balance', getAllBalance);
router.get('/balance/:accountNumber', getUserBalance);
router.post('/create-account',validate(balanceSchema), createAccount);
router.post('/transfer',validate(transferSchema), transfer);

export default router;